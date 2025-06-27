import { Repository } from 'typeorm';
import { Depenses, StatutDepense } from '../entities/entities/Depenses';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Users } from '../entities/entities/Users';
import { Commentaires } from '../entities/entities/Commentaires';
import { Category } from 'src/categories/entities/category.entity';
import { OcrProcessing } from '../entities/entities/OcrProcessing';
import { NlpCategorization } from '../entities/entities/NlpCategorization';
import { CategoriesService } from '../categories/categories.service';
import { Notifications } from '../entities/entities/notifications';
export declare class ExpensesService {
    private readonly expenseRepository;
    private readonly commentRepository;
    private readonly usersRepository;
    private readonly categoryRepository;
    private readonly ocrRepo;
    private readonly nlpRepo;
    private readonly notificationsRepo;
    private readonly categoriesService;
    constructor(expenseRepository: Repository<Depenses>, commentRepository: Repository<Commentaires>, usersRepository: Repository<Users>, categoryRepository: Repository<Category>, ocrRepo: Repository<OcrProcessing>, nlpRepo: Repository<NlpCategorization>, notificationsRepo: Repository<Notifications>, categoriesService: CategoriesService);
    create(createExpenseDto: CreateExpenseDto, userId: string): Promise<Depenses>;
    findAllForUser(user: Users): Promise<Depenses[]>;
    findByUser(userId: string): Promise<Depenses[]>;
    findMine(userId: string, statut?: StatutDepense, free?: boolean): Promise<Depenses[]>;
    findSubmittedByUser(userId: string): Promise<Depenses[]>;
    findOne(id: string): Promise<{
        commentaires: Commentaires[];
        id: string;
        montant: number;
        devise: string;
        dateDepense: Date;
        description: string | null;
        statut: StatutDepense;
        dateCreation: Date;
        dateMiseAJour: Date;
        categorie: Category;
        recu: import("../entities/entities/Recus").Recus;
        user: Users;
        nlpCategorizations: NlpCategorization[];
        reimbursementRequest?: import("../entities/entities/ReimbursementRequest").ReimbursementRequest | undefined;
    }>;
    update(id: string, updateExpenseDto: UpdateExpenseDto): Promise<{
        commentaires: Commentaires[];
        id: string;
        montant: number;
        devise: string;
        dateDepense: Date;
        description: string | null;
        statut: StatutDepense;
        dateCreation: Date;
        dateMiseAJour: Date;
        categorie: Category;
        recu: import("../entities/entities/Recus").Recus;
        user: Users;
        nlpCategorizations: NlpCategorization[];
        reimbursementRequest?: import("../entities/entities/ReimbursementRequest").ReimbursementRequest | undefined;
    }>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    updateStatut(id: string, statut: StatutDepense): Promise<Depenses>;
    getExpenseStats(): Promise<{
        totalCount: number;
        totalAmount: number;
        statusCounts: Record<string, number>;
    }>;
    addComment(expenseId: string, contenu: string, user: Users): Promise<Commentaires>;
    getStatsForUser(userId: string): Promise<{
        totalMontant: number;
        countByStatut: Record<string, number>;
        lastExpenses: {
            id: string;
            montant: number;
            dateDepense: string;
            statut: string;
            description: string;
        }[];
    }>;
    getStatsForManager(): Promise<{
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
    }>;
    detectAndAssignCategory(ocrProcessingId: string, depenseId: string): Promise<NlpCategorization | null>;
}
