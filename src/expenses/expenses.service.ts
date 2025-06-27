import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Depenses, StatutDepense } from '../entities/entities/Depenses';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Users } from '../entities/entities/Users';
import { Commentaires } from '../entities/entities/Commentaires';
import { Category } from 'src/categories/entities/category.entity';
import { randomUUID } from 'crypto';
import { OcrProcessing } from '../entities/entities/OcrProcessing';
import { NlpCategorization } from '../entities/entities/NlpCategorization';
import { CategoriesService } from '../categories/categories.service';
import { Notifications, NotificationType } from '../entities/entities/notifications';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Depenses)
    private readonly expenseRepository: Repository<Depenses>,

    @InjectRepository(Commentaires)
    private readonly commentRepository: Repository<Commentaires>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(OcrProcessing)
    private readonly ocrRepo: Repository<OcrProcessing>,

    @InjectRepository(NlpCategorization)
    private readonly nlpRepo: Repository<NlpCategorization>,
    
    @InjectRepository(Notifications)
    private readonly notificationsRepo: Repository<Notifications>,    

    private readonly categoriesService: CategoriesService,

  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    let category: Category | null = null;
    if ((createExpenseDto as any).categorieId) {
      category = await this.categoryRepository.findOne({
        where: { id: (createExpenseDto as any).categorieId },
      });
    }

    const now = new Date();
    const expense = this.expenseRepository.create({
      id: randomUUID(),
      montant: parseFloat(createExpenseDto.montant as any),
      devise: createExpenseDto.devise,
      dateDepense: new Date(createExpenseDto.dateDepense),
      description: createExpenseDto.description,
      statut: StatutDepense.SUBMITTED,
      dateCreation: now,
      dateMiseAJour: now,
      user,
      categorie: category || undefined,
    });

    return this.expenseRepository.save(expense);
  }

  async findAllForUser(user: Users) {
    const isAdminOrManager = user.roles?.some((r) =>
      ['ADMIN', 'MANAGER'].includes(r.nom),
    );

    if (isAdminOrManager) {
      return this.expenseRepository.find({
        relations: ['user', 'categorie'],
        order: { dateDepense: 'DESC' },
      });
    }

    return this.findByUser(user.id);
  }

  async findByUser(userId: string) {
    return this.expenseRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'categorie'],
      order: { dateDepense: 'DESC' },
    });
  }

  async findMine(userId: string, statut?: StatutDepense, free?: boolean) {
    const query = this.expenseRepository
      .createQueryBuilder('depense')
      .leftJoinAndSelect('depense.user', 'user')
      .leftJoinAndSelect('depense.categorie', 'categorie')
      .where('user.id = :userId', { userId });

    if (statut) {
      query.andWhere('depense.statut = :statut', { statut });
    }

    if (free === true) {
      query.andWhere('depense.reimbursementRequest IS NULL');
    }

    return query.orderBy('depense.dateDepense', 'DESC').getMany();
  }

  async findSubmittedByUser(userId: string) {
    return this.expenseRepository.find({
      where: {
        user: { id: userId },
        statut: StatutDepense.SUBMITTED,
      },
      relations: ['user', 'categorie'],
      order: { dateDepense: 'DESC' },
    });
  }

  async findOne(id: string) {
    const depense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['user', 'categorie', 'recu'], 
    });
  
    if (!depense) throw new NotFoundException('Dépense non trouvée');
  
    const commentaires = await this.commentRepository.find({
      where: {
        entityId: id,
        entityType: 'EXPENSE',
      },
      relations: ['utilisateur'],
      order: { dateCreation: 'ASC' },
    });
  
    return { ...depense, commentaires };
  }
  

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const data = { ...updateExpenseDto } as any;

    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('Aucune donnée fournie pour la mise à jour.');
    }

    if (data.montant !== undefined) {
      data.montant = parseFloat(data.montant);
    }

    if (data.categorieId) {
      const category = await this.categoryRepository.findOne({
        where: { id: data.categorieId },
      });
      if (!category) throw new NotFoundException('Catégorie non trouvée');
      data.categorie = category;
    }

    data.dateMiseAJour = new Date();

    await this.expenseRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    const depense = await this.expenseRepository.findOne({ where: { id } });
    if (!depense) throw new NotFoundException('Dépense introuvable');
    return this.expenseRepository.delete(id);
  }

  async updateStatut(id: string, statut: StatutDepense) {
    const depense = await this.expenseRepository.findOne({ where: { id } });
    if (!depense) throw new NotFoundException('Dépense introuvable');

    depense.statut = statut;
    depense.dateMiseAJour = new Date();

    return this.expenseRepository.save(depense);
  }

  async getExpenseStats(): Promise<{
    totalCount: number;
    totalAmount: number;
    statusCounts: Record<string, number>;
  }> {
    const all = await this.expenseRepository.find();

    const totalCount = all.length;
    const totalAmount = all.reduce(
      (sum, e) => sum + parseFloat(e.montant as any),
      0,
    );

    const statusCounts = all.reduce((acc, e) => {
      acc[e.statut] = (acc[e.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalCount, totalAmount, statusCounts };
  }

  async addComment(expenseId: string, contenu: string, user: Users) {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['user'],
    });
  
    if (!expense) throw new NotFoundException('Dépense introuvable');
  
    const comment = this.commentRepository.create({
      id: randomUUID(),
      contenu,
      dateCreation: new Date(),
      dateMiseAJour: new Date(),
      entityType: 'EXPENSE',
      entityId: expenseId,
      utilisateur: user,
    });
  
    const saved = await this.commentRepository.save(comment);
  
    // ✅ Créer une notification si l'auteur ≠ propriétaire de la dépense
    if (user.id !== expense.user.id) {
      const notif = this.notificationsRepo.create({
        type: NotificationType.COMMENT,
        contenu: `💬 Nouveau commentaire de ${user.prenom} ${user.nom} sur votre dépense`,
        user: expense.user,
        estLue: false,
        dateCreation: new Date(),
        dateLecture: null,
        targetUrl: `/expenses/${expenseId}#comment-${saved.id}`,
      });
  
      await this.notificationsRepo.save(notif);
    }
  
    return saved;
  }
  
  

  async getStatsForUser(userId: string): Promise<{
    totalMontant: number;
    countByStatut: Record<string, number>;
    lastExpenses: {
      id: string;
      montant: number;
      dateDepense: string;
      statut: string;
      description: string;
    }[];
  }> {
    const expenses = await this.expenseRepository.find({
      where: { user: { id: userId } },
      order: { dateDepense: 'DESC' },
    });

    const totalMontant = expenses.reduce(
      (sum, d) => sum + parseFloat(d.montant as any),
      0,
    );

    const countByStatut = expenses.reduce((acc, d) => {
      acc[d.statut] = (acc[d.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const lastExpenses = expenses.slice(0, 3).map((e) => ({
      id: e.id,
      montant: e.montant,
      dateDepense: new Date(e.dateDepense).toISOString(),
      statut: e.statut,
      description: e.description || '',
    }));

    return {
      totalMontant,
      countByStatut,
      lastExpenses,
    };
  }

  async getStatsForManager(): Promise<{
    totalPending: number;
    montantPending: number;
    countByStatut: Record<string, number>;
    lastSubmissions: {
      id: string;
      montant: number;
      dateDepense: string;
      statut: string;
      user: {
        prenom: string;
        nom: string;
        email: string;
      };
    }[];
  }> {
    const expenses = await this.expenseRepository.find({
      relations: ['user'],
      order: { dateCreation: 'DESC' },
    });

    const totalPending = expenses.filter((e) => e.statut === StatutDepense.SUBMITTED).length;
    const montantPending = expenses
      .filter((e) => e.statut === StatutDepense.SUBMITTED)
      .reduce((sum, e) => sum + parseFloat(e.montant as any), 0);

    const countByStatut = expenses.reduce((acc, d) => {
      acc[d.statut] = (acc[d.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const lastSubmissions = expenses
      .filter((e) => e.statut === StatutDepense.SUBMITTED)
      .slice(0, 5)
      .map((e) => ({
        id: e.id,
        montant: parseFloat(e.montant as any),
        dateDepense: new Date(e.dateDepense).toISOString(),
        statut: e.statut,
        user: {
          prenom: e.user.prenom,
          nom: e.user.nom,
          email: e.user.email,
        },
      }));

    return {
      totalPending,
      montantPending,
      countByStatut,
      lastSubmissions,
    };
  }
  async detectAndAssignCategory(ocrProcessingId: string, depenseId: string) {
    const ocr = await this.ocrRepo.findOne({
      where: { id: ocrProcessingId },
    });
  
    if (!ocr || !ocr.texteExtrait) return null;
  
    const texte = ocr.texteExtrait
      .toLowerCase()
      .normalize('NFD') // supprime accents
      .replace(/[\u0300-\u036f]/g, '') // caractères combinés
      .replace(/[^\w\s]/gi, '') // ponctuation
      .replace(/\s+/g, ' ') // espaces multiples
      .trim();
  
    console.log('🧾 TEXTE OCR NETTOYÉ >>>', texte);
  
    const categories: Record<string, string[]> = {
      Transport: ['uber', 'taxi', 'train', 'péage', 'essence', 'tram', 'snrt', 'carburant', 'station'],
      Hebergement: ['hotel', 'hôtel', 'riad', 'booking', 'chambre', 'nuit', 'motel', 'airbnb'],
      Repas: ['restaurant', 'resto', 'repas', 'dejeuner', 'diner', 'pizza', 'mcdo', 'kfc', 'cafe', 'snack'],
      Fournitures: ['papeterie', 'stylo', 'clavier', 'fourniture', 'cartouche', 'souris', 'bureautique'],
      Communication: ['iam', 'inwi', 'orange', 'internet', 'recharge', 'forfait', 'modem', 'abonnement'],
    };
  
    let bestCategory = 'Autre';
    let bestMatchCount = 0;
  
    for (const [category, mots] of Object.entries(categories)) {
      let matchCount = 0;
  
      for (const mot of mots) {
        const regex = new RegExp(`\\b${mot}\\b`, 'i'); 
        if (regex.test(texte)) {
          matchCount++;
          console.log(` Mot détecté : ${mot} → catégorie "${category}"`);
        }
      }
  
      if (matchCount > bestMatchCount) {
        bestCategory = category;
        bestMatchCount = matchCount;
      }
    }
  
    console.log(`📊 Catégorie la plus probable : ${bestCategory} (${bestMatchCount} mots trouvés)`);
  
    const matchedCategory = await this.categoriesService.findByNom(bestCategory);
  
    const categorisationData: Partial<NlpCategorization> = {
      id: randomUUID(),
      depense: { id: depenseId } as any,
      ocrProcessing: { id: ocrProcessingId } as any,
      scoreConfiance: (bestMatchCount > 0 ? 1 : 0).toFixed(4),
      dateAnalyse: new Date(),
    };
  
    if (matchedCategory) {
      categorisationData.categorieProposee = matchedCategory;
    }
  
    return this.nlpRepo.save(this.nlpRepo.create(categorisationData));
  }
  
} 