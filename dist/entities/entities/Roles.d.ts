import { UserRoles } from './UserRoles';
import { Users } from './Users';
export declare class Roles {
    id: string;
    nom: string;
    dateCreation: Date;
    dateMiseAJour: Date;
    userRoles: UserRoles[];
    users: Users[];
}
