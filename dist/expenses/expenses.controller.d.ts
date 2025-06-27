import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { StatutDepense } from '../entities/entities/Depenses';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto, req: any): Promise<import("../entities/entities/Depenses").Depenses>;
    findAll(req: any): Promise<import("../entities/entities/Depenses").Depenses[]>;
    getMyExpenses(req: any, statut?: StatutDepense, freeParam?: string): Promise<import("../entities/entities/Depenses").Depenses[]>;
    getMyStats(req: any): Promise<{
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
    getManagerStats(): Promise<{
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
    getExpensesByUser(userId: string): Promise<import("../entities/entities/Depenses").Depenses[]>;
    getStats(): Promise<{
        totalCount: number;
        totalAmount: number;
        statusCounts: Record<string, number>;
    }>;
    findOne(id: string): Promise<{
        commentaires: import("../entities/entities/Commentaires").Commentaires[];
        id: string;
        montant: number;
        devise: string;
        dateDepense: Date;
        description: string | null;
        statut: StatutDepense;
        dateCreation: Date;
        dateMiseAJour: Date;
        categorie: import("../categories/entities/category.entity").Category;
        recu: import("../entities/entities/Recus").Recus;
        user: import("../entities/entities/Users").Users;
        nlpCategorizations: import("../entities/entities/NlpCategorization").NlpCategorization[];
        reimbursementRequest?: import("../entities/entities/ReimbursementRequest").ReimbursementRequest | undefined;
    }>;
    update(id: string, updateExpenseDto: UpdateExpenseDto): Promise<{
        commentaires: import("../entities/entities/Commentaires").Commentaires[];
        id: string;
        montant: number;
        devise: string;
        dateDepense: Date;
        description: string | null;
        statut: StatutDepense;
        dateCreation: Date;
        dateMiseAJour: Date;
        categorie: import("../categories/entities/category.entity").Category;
        recu: import("../entities/entities/Recus").Recus;
        user: import("../entities/entities/Users").Users;
        nlpCategorizations: import("../entities/entities/NlpCategorization").NlpCategorization[];
        reimbursementRequest?: import("../entities/entities/ReimbursementRequest").ReimbursementRequest | undefined;
    }>;
    updateStatut(id: string, statut: StatutDepense): Promise<import("../entities/entities/Depenses").Depenses>;
    addComment(id: string, contenu: string, req: any): Promise<import("../entities/entities/Commentaires").Commentaires>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}
