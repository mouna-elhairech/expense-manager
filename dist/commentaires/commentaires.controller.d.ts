import { CommentairesService } from './commentaires.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
export declare class CommentairesController {
    private readonly commentairesService;
    constructor(commentairesService: CommentairesService);
    create(body: CreateCommentaireDto, req: any): Promise<import("../entities/entities/Commentaires").Commentaires>;
    findByEntity(entityId: string, entityType?: 'EXPENSE' | 'REIMBURSEMENT_REQUEST'): Promise<import("../entities/entities/Commentaires").Commentaires[]>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
