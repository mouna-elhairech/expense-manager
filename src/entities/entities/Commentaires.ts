import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Index("commentaires_pkey", ["id"], { unique: true })
@Entity("commentaires", { schema: "public" })
export class Commentaires {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("text", { name: "contenu" })
  contenu: string;

  @Column("character varying", { name: "entity_type", length: 50 })
  entityType: string;

  @Column("uuid", { name: "entity_id" })
  entityId: string;

  @Column("timestamp with time zone", { name: "date_creation" })
  dateCreation: Date;

  @Column("timestamp with time zone", { name: "date_mise_a_jour" })
  dateMiseAJour: Date;

  @ManyToOne(() => Users, (users) => users.commentaires, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  utilisateur: Users;
}
