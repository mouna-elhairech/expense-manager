import { Users } from "./Users";
export declare enum NotificationType {
    APPROVAL = "APPROVAL",
    REJECTION = "REJECTION",
    REIMBURSEMENT = "REIMBURSEMENT",
    REMINDER = "REMINDER",
    COMMENT = "COMMENT"
}
export declare class Notifications {
    id: string;
    type: NotificationType;
    contenu: string;
    estLue: boolean;
    dateCreation: Date;
    dateLecture: Date | null;
    targetUrl: string | null;
    user: Users;
}
