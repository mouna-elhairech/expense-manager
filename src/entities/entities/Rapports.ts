import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "./Users";

@Index("rapports_pkey", ["id"], { unique: true })
@Entity("rapports", { schema: "public" })
export class Rapports {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "titre", length: 255 })
  titre: string;

  @Column("date", { name: "date_debut" })
  dateDebut: string;

  @Column("date", { name: "date_fin" })
  dateFin: string;

  @Column("character varying", { name: "format", length: 10 })
  format: string;

  @Column("timestamp with time zone", { name: "date_generation" })
  dateGeneration: Date;

  @ManyToOne(() => Users, (users) => users.rapports, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
