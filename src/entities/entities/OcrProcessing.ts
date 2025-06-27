import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { NlpCategorization } from './NlpCategorization'; // ✅ Chemin corrigé
import { Recus } from './Recus';

@Index('ocr_processing_pkey', ['id'], { unique: true })
@Entity('ocr_processing', { schema: 'public' })
export class OcrProcessing {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('numeric', {
    name: 'niveau_confiance',
    nullable: true,
    precision: 5,
    scale: 4,
  })
  niveauConfiance: string | null;

  @Column('jsonb', { name: 'donnees_extraites', nullable: true })
  donneesExtraites: object | null;

  @Column('text', { name: 'texte_extrait', nullable: true })
  texteExtrait: string | null;

  @Column('text', { name: 'details_erreur', nullable: true })
  detailsErreur: string | null;

  @Column('timestamp with time zone', { name: 'date_creation' })
  dateCreation: Date;

  @Column('timestamp with time zone', { name: 'date_mise_a_jour' })
  dateMiseAJour: Date;

  @OneToMany(
    () => NlpCategorization,
    (nlpCategorization) => nlpCategorization.ocrProcessing,
    { cascade: true }
  )
  nlpCategorizations: NlpCategorization[];

  @OneToOne(() => Recus, (recu) => recu.ocrProcessing)
  @JoinColumn({ name: 'recu_id' })
  recu: Recus;
}
