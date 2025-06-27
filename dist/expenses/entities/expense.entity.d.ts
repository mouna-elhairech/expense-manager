import { User } from 'src/users/entities/user.entity';
export declare enum StatutDepense {
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    REIMBURSED = "REIMBURSED"
}
export declare class Expense {
    id: string;
    montant: number;
    devise: string;
    dateDepense: Date;
    description: string;
    statut: StatutDepense;
    dateCreation: Date;
    dateMiseAJour: Date;
    user: User;
    userId: string;
}
