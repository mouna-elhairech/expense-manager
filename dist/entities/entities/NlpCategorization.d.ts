import { Category } from '../../categories/entities/category.entity';
import { Depenses } from './Depenses';
import { OcrProcessing } from './OcrProcessing';
export declare class NlpCategorization {
    id: string;
    scoreConfiance: string | null;
    dateAnalyse: Date;
    categorieProposee: Category;
    depense: Depenses;
    ocrProcessing: OcrProcessing;
}
