"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Depenses_1 = require("../entities/entities/Depenses");
const Users_1 = require("../entities/entities/Users");
const Commentaires_1 = require("../entities/entities/Commentaires");
const category_entity_1 = require("../categories/entities/category.entity");
const crypto_1 = require("crypto");
const OcrProcessing_1 = require("../entities/entities/OcrProcessing");
const NlpCategorization_1 = require("../entities/entities/NlpCategorization");
const categories_service_1 = require("../categories/categories.service");
const notifications_1 = require("../entities/entities/notifications");
let ExpensesService = class ExpensesService {
    constructor(expenseRepository, commentRepository, usersRepository, categoryRepository, ocrRepo, nlpRepo, notificationsRepo, categoriesService) {
        this.expenseRepository = expenseRepository;
        this.commentRepository = commentRepository;
        this.usersRepository = usersRepository;
        this.categoryRepository = categoryRepository;
        this.ocrRepo = ocrRepo;
        this.nlpRepo = nlpRepo;
        this.notificationsRepo = notificationsRepo;
        this.categoriesService = categoriesService;
    }
    async create(createExpenseDto, userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        let category = null;
        if (createExpenseDto.categorieId) {
            category = await this.categoryRepository.findOne({
                where: { id: createExpenseDto.categorieId },
            });
        }
        const now = new Date();
        const expense = this.expenseRepository.create({
            id: (0, crypto_1.randomUUID)(),
            montant: parseFloat(createExpenseDto.montant),
            devise: createExpenseDto.devise,
            dateDepense: new Date(createExpenseDto.dateDepense),
            description: createExpenseDto.description,
            statut: Depenses_1.StatutDepense.SUBMITTED,
            dateCreation: now,
            dateMiseAJour: now,
            user,
            categorie: category || undefined,
        });
        return this.expenseRepository.save(expense);
    }
    async findAllForUser(user) {
        const isAdminOrManager = user.roles?.some((r) => ['ADMIN', 'MANAGER'].includes(r.nom));
        if (isAdminOrManager) {
            return this.expenseRepository.find({
                relations: ['user', 'categorie'],
                order: { dateDepense: 'DESC' },
            });
        }
        return this.findByUser(user.id);
    }
    async findByUser(userId) {
        return this.expenseRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'categorie'],
            order: { dateDepense: 'DESC' },
        });
    }
    async findMine(userId, statut, free) {
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
    async findSubmittedByUser(userId) {
        return this.expenseRepository.find({
            where: {
                user: { id: userId },
                statut: Depenses_1.StatutDepense.SUBMITTED,
            },
            relations: ['user', 'categorie'],
            order: { dateDepense: 'DESC' },
        });
    }
    async findOne(id) {
        const depense = await this.expenseRepository.findOne({
            where: { id },
            relations: ['user', 'categorie', 'recu'],
        });
        if (!depense)
            throw new common_1.NotFoundException('Dépense non trouvée');
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
    async update(id, updateExpenseDto) {
        const data = { ...updateExpenseDto };
        if (!data || Object.keys(data).length === 0) {
            throw new common_1.BadRequestException('Aucune donnée fournie pour la mise à jour.');
        }
        if (data.montant !== undefined) {
            data.montant = parseFloat(data.montant);
        }
        if (data.categorieId) {
            const category = await this.categoryRepository.findOne({
                where: { id: data.categorieId },
            });
            if (!category)
                throw new common_1.NotFoundException('Catégorie non trouvée');
            data.categorie = category;
        }
        data.dateMiseAJour = new Date();
        await this.expenseRepository.update(id, data);
        return this.findOne(id);
    }
    async remove(id) {
        const depense = await this.expenseRepository.findOne({ where: { id } });
        if (!depense)
            throw new common_1.NotFoundException('Dépense introuvable');
        return this.expenseRepository.delete(id);
    }
    async updateStatut(id, statut) {
        const depense = await this.expenseRepository.findOne({ where: { id } });
        if (!depense)
            throw new common_1.NotFoundException('Dépense introuvable');
        depense.statut = statut;
        depense.dateMiseAJour = new Date();
        return this.expenseRepository.save(depense);
    }
    async getExpenseStats() {
        const all = await this.expenseRepository.find();
        const totalCount = all.length;
        const totalAmount = all.reduce((sum, e) => sum + parseFloat(e.montant), 0);
        const statusCounts = all.reduce((acc, e) => {
            acc[e.statut] = (acc[e.statut] || 0) + 1;
            return acc;
        }, {});
        return { totalCount, totalAmount, statusCounts };
    }
    async addComment(expenseId, contenu, user) {
        const expense = await this.expenseRepository.findOne({
            where: { id: expenseId },
            relations: ['user'],
        });
        if (!expense)
            throw new common_1.NotFoundException('Dépense introuvable');
        const comment = this.commentRepository.create({
            id: (0, crypto_1.randomUUID)(),
            contenu,
            dateCreation: new Date(),
            dateMiseAJour: new Date(),
            entityType: 'EXPENSE',
            entityId: expenseId,
            utilisateur: user,
        });
        const saved = await this.commentRepository.save(comment);
        if (user.id !== expense.user.id) {
            const notif = this.notificationsRepo.create({
                type: notifications_1.NotificationType.COMMENT,
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
    async getStatsForUser(userId) {
        const expenses = await this.expenseRepository.find({
            where: { user: { id: userId } },
            order: { dateDepense: 'DESC' },
        });
        const totalMontant = expenses.reduce((sum, d) => sum + parseFloat(d.montant), 0);
        const countByStatut = expenses.reduce((acc, d) => {
            acc[d.statut] = (acc[d.statut] || 0) + 1;
            return acc;
        }, {});
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
    async getStatsForManager() {
        const expenses = await this.expenseRepository.find({
            relations: ['user'],
            order: { dateCreation: 'DESC' },
        });
        const totalPending = expenses.filter((e) => e.statut === Depenses_1.StatutDepense.SUBMITTED).length;
        const montantPending = expenses
            .filter((e) => e.statut === Depenses_1.StatutDepense.SUBMITTED)
            .reduce((sum, e) => sum + parseFloat(e.montant), 0);
        const countByStatut = expenses.reduce((acc, d) => {
            acc[d.statut] = (acc[d.statut] || 0) + 1;
            return acc;
        }, {});
        const lastSubmissions = expenses
            .filter((e) => e.statut === Depenses_1.StatutDepense.SUBMITTED)
            .slice(0, 5)
            .map((e) => ({
            id: e.id,
            montant: parseFloat(e.montant),
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
    async detectAndAssignCategory(ocrProcessingId, depenseId) {
        const ocr = await this.ocrRepo.findOne({
            where: { id: ocrProcessingId },
        });
        if (!ocr || !ocr.texteExtrait)
            return null;
        const texte = ocr.texteExtrait
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        console.log('🧾 TEXTE OCR NETTOYÉ >>>', texte);
        const categories = {
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
        const categorisationData = {
            id: (0, crypto_1.randomUUID)(),
            depense: { id: depenseId },
            ocrProcessing: { id: ocrProcessingId },
            scoreConfiance: (bestMatchCount > 0 ? 1 : 0).toFixed(4),
            dateAnalyse: new Date(),
        };
        if (matchedCategory) {
            categorisationData.categorieProposee = matchedCategory;
        }
        return this.nlpRepo.save(this.nlpRepo.create(categorisationData));
    }
};
ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Depenses_1.Depenses)),
    __param(1, (0, typeorm_1.InjectRepository)(Commentaires_1.Commentaires)),
    __param(2, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __param(3, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(4, (0, typeorm_1.InjectRepository)(OcrProcessing_1.OcrProcessing)),
    __param(5, (0, typeorm_1.InjectRepository)(NlpCategorization_1.NlpCategorization)),
    __param(6, (0, typeorm_1.InjectRepository)(notifications_1.Notifications)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        categories_service_1.CategoriesService])
], ExpensesService);
exports.ExpensesService = ExpensesService;
//# sourceMappingURL=expenses.service.js.map