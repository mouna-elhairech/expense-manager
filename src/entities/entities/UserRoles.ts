import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Roles } from "./Roles";
import { Users } from "./Users";

@Index("user_roles_pkey", ["id"], { unique: true })
@Index("user_roles_user_id_role_id_unique", ["roleId", "userId"], {
  unique: true,
})
@Entity("user_roles", { schema: "public" })
export class UserRoles {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("uuid", { name: "user_id", unique: true })
  userId: string;

  @Column("uuid", { name: "role_id", unique: true })
  roleId: string;

  @Column("uuid", { name: "attribue_par", nullable: true })
  attribuePar: string | null;

  @Column("timestamp with time zone", { name: "date_creation" })
  dateCreation: Date;

  @Column('timestamptz', { name: 'date_mise_a_jour' })
  dateMiseAJour: Date
  

  @ManyToOne(() => Roles, (roles) => roles.userRoles, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Roles;

  @ManyToOne(() => Users, (users) => users.userRoles, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
