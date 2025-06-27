import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

export enum NotificationType {
  APPROVAL = 'APPROVAL',
  REJECTION = 'REJECTION',
  REIMBURSEMENT = 'REIMBURSEMENT',
  REMINDER = 'REMINDER',
  COMMENT = 'COMMENT' // ✅ Ajoute cette ligne si elle n'existe pas
}

@Index("notifications_pkey", ["id"], { unique: true })
@Entity("notifications", { schema: "public" })
export class Notifications {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: NotificationType, name: "type" })
  type: NotificationType;

  @Column("text", { name: "contenu" })
  contenu: string;

  @Column("boolean", { name: "est_lue" })
  estLue: boolean;

  @Column("timestamp with time zone", { name: "date_creation" })
  dateCreation: Date;

  @Column("timestamp with time zone", { name: "date_lecture", nullable: true })
  dateLecture: Date | null;

  // ✅ Nouveau champ : lien cible
  @Column("text", { name: "target_url", nullable: true })
  targetUrl: string | null;

  @ManyToOne(() => Users, (users) => users.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
