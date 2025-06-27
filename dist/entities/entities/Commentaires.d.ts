import { Users } from "./Users";
export declare class Commentaires {
    id: string;
    contenu: string;
    entityType: string;
    entityId: string;
    dateCreation: Date;
    dateMiseAJour: Date;
    utilisateur: Users;
}
