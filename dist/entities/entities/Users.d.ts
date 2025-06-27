import { Commentaires } from './Commentaires';
import { Depenses } from './Depenses';
import { Notifications } from './notifications';
import { Rapports } from './Rapports';
import { UserRoles } from './UserRoles';
import { Roles } from './Roles';
export declare class Users {
    id: string;
    email: string;
    motDePasse: string;
    prenom: string;
    nom: string;
    telephone: string | null;
    photoProfil: string | null;
    dateCreation: Date;
    dateMiseAJour: Date;
    commentaires: Commentaires[];
    depenses: Depenses[];
    notifications: Notifications[];
    rapports: Rapports[];
    userRoles: UserRoles[];
    roles: Roles[];
}
