import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  ocrEnabled: boolean;

  @Column({ default: true })
  notificationsEnabled: boolean;
}
