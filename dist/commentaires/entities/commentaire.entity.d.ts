import { User } from 'src/users/entities/user.entity';
export declare class Commentaires {
    id: string;
    contenu: string;
    dateCreation: Date;
    dateMiseAJour: Date;
    entityType: string;
    entityId: string;
    utilisateur: User;
}
