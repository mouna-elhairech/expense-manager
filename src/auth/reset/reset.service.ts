import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Users } from 'src/entities/entities/Users';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetToken } from 'src/entities/entities/ResetToken';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/common/services/email.service';

@Injectable()
export class ResetService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,

    @InjectRepository(ResetToken)
    private readonly resetTokenRepo: Repository<ResetToken>,

    private readonly emailService: EmailService,
  ) {}

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) return; // Ne pas révéler si l'utilisateur existe

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    const reset = this.resetTokenRepo.create({
      token,
      user,
      user_id: user.id,
      expiresAt: expiration,
    });

    await this.resetTokenRepo.save(reset);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.emailService.sendResetPasswordEmail(
      user.email,
      resetLink,
      user.prenom,
    );
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }

    const tokenRecord = await this.resetTokenRepo.findOne({
      where: {
        token,
        used: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    if (!tokenRecord) {
      throw new BadRequestException('Lien invalide ou expiré.');
    }

    const user = tokenRecord.user;
    user.motDePasse = await bcrypt.hash(newPassword, 10);
    await this.userRepo.save(user);

    tokenRecord.used = true;
    await this.resetTokenRepo.save(tokenRecord);
  }

  async cleanExpiredTokens() {
    await this.resetTokenRepo.delete({ expiresAt: LessThan(new Date()) });
  }
}
