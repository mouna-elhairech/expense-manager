import { Depenses } from 'src/entities/entities/Depenses';
import { NlpCategorization } from 'src/entities/entities/NlpCategorization';
export declare class Category {
    id: string;
    nom: string;
    icone: string | null;
    limiteBudget: string | null;
    depenses: Depenses[];
    nlpCategorizations: NlpCategorization[];
}
