import {
  Column,
  Entity,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Commentaires } from './Commentaires';
import { Depenses } from './Depenses';
import { Notifications } from './notifications';
import { Rapports } from './Rapports';
import { UserRoles } from './UserRoles';
import { Roles } from './Roles';

@Index('users_email_unique', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class Users {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('character varying', { name: 'email', unique: true, length: 255 })
  email: string;

  @Column('character varying', { name: 'mot_de_passe', length: 255 })
  motDePasse: string;

  @Column('character varying', { name: 'prenom', length: 100 })
  prenom: string;

  @Column('character varying', { name: 'nom', length: 100 })
  nom: string;

  @Column('character varying', {
    name: 'telephone',
    nullable: true,
    length: 20,
  })
  telephone: string | null;

  @Column('character varying', {
    name: 'photo_profil',
    nullable: true,
    length: 255,
  })
  photoProfil: string | null;

  @Column('timestamp with time zone', { name: 'date_creation' })
  dateCreation: Date;

  @Column('timestamp with time zone', { name: 'date_mise_a_jour' })
  dateMiseAJour: Date;

  @OneToMany(() => Commentaires, (commentaires) => commentaires.utilisateur)
  commentaires: Commentaires[];

  @OneToMany(() => Depenses, (depenses) => depenses.user)
  depenses: Depenses[];

  @OneToMany(() => Notifications, (notifications) => notifications.user)
  notifications: Notifications[];

  @OneToMany(() => Rapports, (rapports) => rapports.user)
  rapports: Rapports[];

  @OneToMany(() => UserRoles, (userRoles) => userRoles.user)
  userRoles: UserRoles[];

  @ManyToMany(() => Roles, (role) => role.users, { eager: false })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Roles[];
}
