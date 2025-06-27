import { Depenses } from "./Depenses";
import { OcrProcessing } from "./OcrProcessing";
export declare class Recus {
    id: string;
    nomFichier: string;
    cheminStockage: string;
    montant: string | null;
    fournisseur: string | null;
    date: string | null;
    estTraite: boolean | null;
    dateCreation: Date;
    dateMiseAJour: Date;
    depenses: Depenses[];
    ocrProcessing: OcrProcessing;
}
