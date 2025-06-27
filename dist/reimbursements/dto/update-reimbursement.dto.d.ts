import { ReimbursementStatus } from 'src/entities/entities/ReimbursementRequest';
export declare class UpdateReimbursementDto {
    statut: ReimbursementStatus;
    notes?: string;
    approvedBy?: string;
}
