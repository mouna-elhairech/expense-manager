import { Roles } from "./Roles";
import { Users } from "./Users";
export declare class UserRoles {
    id: string;
    userId: string;
    roleId: string;
    attribuePar: string | null;
    dateCreation: Date;
    dateMiseAJour: Date;
    role: Roles;
    user: Users;
}
