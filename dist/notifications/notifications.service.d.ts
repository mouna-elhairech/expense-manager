import { Repository } from 'typeorm';
import { Notifications, NotificationType } from '../entities/entities/notifications';
import { Users } from '../entities/entities/Users';
export declare class NotificationsService {
    private readonly notificationRepository;
    private readonly usersRepository;
    constructor(notificationRepository: Repository<Notifications>, usersRepository: Repository<Users>);
    create(userId: string, type: NotificationType, contenu: string, targetUrl?: string | null): Promise<Notifications>;
    findByUser(userId: string): Promise<Notifications[]>;
    markAsRead(id: string): Promise<Notifications>;
}
