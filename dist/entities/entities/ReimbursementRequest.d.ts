import { Users } from './Users';
import { Depenses } from './Depenses';
export declare enum ReimbursementStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class ReimbursementRequest {
    id: string;
    statut: ReimbursementStatus;
    montantTotal: number;
    notes: string;
    approvedBy?: Users;
    dateCreation: Date;
    dateApprobation?: Date;
    depenses: Depenses[];
}
