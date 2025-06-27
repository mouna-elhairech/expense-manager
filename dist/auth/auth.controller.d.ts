import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { ForgotPasswordDto } from './reset/dto/forgot-password.dto';
import { ResetPasswordDto } from './reset/dto/reset-password.dto';
import { ResetService } from './reset/reset.service';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private authService;
    private usersService;
    private rolesService;
    private resetService;
    private readonly logger;
    constructor(authService: AuthService, usersService: UsersService, rolesService: RolesService, resetService: ResetService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            roles: string[];
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    createAdmin(): Promise<{
        message: string;
        id: string;
        user?: undefined;
    } | {
        message: string;
        user: {
            id: string;
            email: string;
        };
        id?: undefined;
    }>;
    createTestUser(): Promise<{
        message: string;
        id: string;
    }>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
