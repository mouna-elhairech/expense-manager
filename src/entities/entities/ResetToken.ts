import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { Users } from './Users';
  
  @Entity('reset_tokens')
  export class ResetToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    token: string;
  
    @ManyToOne(() => Users, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Users;
  
    @Column()
    user_id: string;
  
    @Column({ type: 'timestamp' })
    expiresAt: Date;
  
    @Column({ default: false })
    used: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
    
  }
  