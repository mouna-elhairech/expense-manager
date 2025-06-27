import { Recus } from './Recus';
import { Users } from './Users';
import { Category } from '../../categories/entities/category.entity';
import { NlpCategorization } from './NlpCategorization';
import { ReimbursementRequest } from './ReimbursementRequest';
export declare enum StatutDepense {
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    REIMBURSED = "REIMBURSED"
}
export declare class Depenses {
    id: string;
    montant: number;
    devise: string;
    dateDepense: Date;
    description: string | null;
    statut: StatutDepense;
    dateCreation: Date;
    dateMiseAJour: Date;
    categorie: Category;
    recu: Recus;
    user: Users;
    nlpCategorizations: NlpCategorization[];
    reimbursementRequest?: ReimbursementRequest;
}
