import { Repository } from 'typeorm';
import { Commentaires } from '../entities/entities/Commentaires';
import { Depenses } from '../entities/entities/Depenses';
import { Users } from '../entities/entities/Users';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class CommentairesService {
    private readonly commentRepository;
    private readonly depenseRepository;
    private readonly usersRepository;
    private readonly notificationsService;
    constructor(commentRepository: Repository<Commentaires>, depenseRepository: Repository<Depenses>, usersRepository: Repository<Users>, notificationsService: NotificationsService);
    create(dto: CreateCommentaireDto, userId: string): Promise<Commentaires>;
    findByEntityId(entityId: string): Promise<Commentaires[]>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Commentaires | null>;
}
