import { StatutDepense } from '../../entities/entities/Depenses';
export declare class CreateExpenseDto {
    montant: number;
    devise: string;
    dateDepense: string;
    description: string;
    statut?: StatutDepense;
    categorieId?: string;
}
