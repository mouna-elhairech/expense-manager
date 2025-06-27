export declare enum StatutDepense {
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    REIMBURSED = "REIMBURSED"
}
export declare class GenerateReportDto {
    dateDebut: string;
    dateFin: string;
    statut: StatutDepense;
}
