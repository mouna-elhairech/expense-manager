import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';
import { Depenses } from './Depenses';
import { OcrProcessing } from './OcrProcessing';

@Index('nlp_categorization_pkey', ['id'], { unique: true })
@Entity('nlp_categorization', { schema: 'public' })
export class NlpCategorization {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('numeric', {
    name: 'score_confiance',
    nullable: true,
    precision: 5,
    scale: 4,
  })
  scoreConfiance: string | null;

  @Column('timestamp with time zone', { name: 'date_analyse' })
  dateAnalyse: Date;

  @ManyToOne(() => Category, (category) => category.nlpCategorizations, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'categorie_proposee_id', referencedColumnName: 'id' }])
  categorieProposee: Category;

  @ManyToOne(() => Depenses, (depenses) => depenses.nlpCategorizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'depense_id', referencedColumnName: 'id' }])
  depense: Depenses;

  @ManyToOne(() => OcrProcessing, (ocr) => ocr.nlpCategorizations, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'ocr_processing_id', referencedColumnName: 'id' }])
  ocrProcessing: OcrProcessing;
}
