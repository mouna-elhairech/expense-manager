import { Repository } from 'typeorm';
import { Users } from 'src/entities/entities/Users';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetToken } from 'src/entities/entities/ResetToken';
import { EmailService } from 'src/common/services/email.service';
export declare class ResetService {
    private readonly userRepo;
    private readonly resetTokenRepo;
    private readonly emailService;
    constructor(userRepo: Repository<Users>, resetTokenRepo: Repository<ResetToken>, emailService: EmailService);
    forgotPassword(dto: ForgotPasswordDto): Promise<void>;
    resetPassword(dto: ResetPasswordDto): Promise<void>;
    cleanExpiredTokens(): Promise<void>;
}
