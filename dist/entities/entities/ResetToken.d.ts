import { Users } from './Users';
export declare class ResetToken {
    id: string;
    token: string;
    user: Users;
    user_id: string;
    expiresAt: Date;
    used: boolean;
    createdAt: Date;
}
