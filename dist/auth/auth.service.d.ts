import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Users } from '../entities/entities/Users';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: Users): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            nom: string;
            prenom: string;
            roles: string[];
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
