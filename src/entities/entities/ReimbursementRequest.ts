// entities\entities\ReimbursementRequest.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Users } from './Users';
import { Depenses } from './Depenses';

export enum ReimbursementStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('reimbursement_request', { schema: 'public' })
export class ReimbursementRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ReimbursementStatus,
    enumName: 'reimbursement_status_enum',
    default: ReimbursementStatus.PENDING,
  })
  statut: ReimbursementStatus;

  @Column('float', { name: 'montant_total', default: 0 }) // ✅ correction ici
  montantTotal: number;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Users, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approvedBy?: Users;

  @CreateDateColumn({ name: 'date_creation' })
  dateCreation: Date;

  @Column({ name: 'date_approbation', type: 'timestamp with time zone', nullable: true })
  dateApprobation?: Date;

  @OneToMany(() => Depenses, (depense) => depense.reimbursementRequest)
  depenses: Depenses[];
}
