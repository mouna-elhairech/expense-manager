import { NlpCategorization } from './NlpCategorization';
import { Recus } from './Recus';
export declare class OcrProcessing {
    id: string;
    niveauConfiance: string | null;
    donneesExtraites: object | null;
    texteExtrait: string | null;
    detailsErreur: string | null;
    dateCreation: Date;
    dateMiseAJour: Date;
    nlpCategorizations: NlpCategorization[];
    recu: Recus;
}
