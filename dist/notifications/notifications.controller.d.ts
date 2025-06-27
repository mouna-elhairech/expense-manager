import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(req: any): Promise<import("../entities/entities/notifications").Notifications[]>;
    markAsRead(id: string): Promise<import("../entities/entities/notifications").Notifications>;
}
