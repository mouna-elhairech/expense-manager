import { Column, Entity, Index, OneToMany, ManyToMany } from 'typeorm';
import { UserRoles } from './UserRoles';
import { Users } from './Users';

@Index('roles_pkey', ['id'], { unique: true })
@Entity('roles', { schema: 'public' })
export class Roles {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('character varying', { name: 'nom', length: 50 })
  nom: string;

  @Column('timestamp with time zone', { name: 'date_creation' })
  dateCreation: Date;

  @Column('timestamp with time zone', { name: 'date_mise_a_jour' })
  dateMiseAJour: Date;

  @OneToMany(() => UserRoles, (userRoles) => userRoles.role)
  userRoles: UserRoles[];

  // ✅ Relation inverse vers Users
  @ManyToMany(() => Users, (user) => user.roles)
  users: Users[];
}
