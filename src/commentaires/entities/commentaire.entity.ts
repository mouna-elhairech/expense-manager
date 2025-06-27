import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from 'src/users/entities/user.entity';
  
  @Entity('commentaires')
  export class Commentaires {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text')
    contenu: string;
  
    @Column({ type: 'timestamp' })
    dateCreation: Date;
  
    @Column({ type: 'timestamp' })
    dateMiseAJour: Date;
  
    @Column()
    entityType: string; // e.g. 'EXPENSE', 'REPORT'...
  
    @Column()
    entityId: string; // ID de l'entité concernée (expense, report...)
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'utilisateur_id' })
    utilisateur: User;
  }
  