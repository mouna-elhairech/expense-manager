import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Recus } from './Recus';
import { Users } from './Users';
import { Category } from '../../categories/entities/category.entity';
import { NlpCategorization } from './NlpCategorization'; // ✅ corrigé ici
import { ReimbursementRequest } from './ReimbursementRequest';

export enum StatutDepense {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REIMBURSED = 'REIMBURSED',
}

@Index('depenses_pkey', ['id'], { unique: true })
@Entity('depenses', { schema: 'public' })
export class Depenses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric', { name: 'montant', precision: 10, scale: 2 })
  montant: number;

  @Column('character varying', { name: 'devise', length: 3 })
  devise: string;

  @Column('date', { name: 'date_depense' })
  dateDepense: Date;  

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: StatutDepense,
    enumName: 'depenses_statut_enum',
    default: StatutDepense.SUBMITTED,
  })
  statut: StatutDepense;

  @Column('timestamp with time zone', { name: 'date_creation' })
  dateCreation: Date;

  @Column('timestamp with time zone', { name: 'date_mise_a_jour' })
  dateMiseAJour: Date;

  @ManyToOne(() => Category, (category) => category.depenses, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'categorie_id', referencedColumnName: 'id' }])
  categorie: Category;

  @ManyToOne(() => Recus, (recus) => recus.depenses, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'recu_id', referencedColumnName: 'id' }])
  recu: Recus;

  @ManyToOne(() => Users, (users) => users.depenses)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @OneToMany(() => NlpCategorization, (nlp) => nlp.depense)
  nlpCategorizations: NlpCategorization[];

  @ManyToOne(() => ReimbursementRequest, (request) => request.depenses, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'reimbursement_request_id', referencedColumnName: 'id' }])
  reimbursementRequest?: ReimbursementRequest;
}
