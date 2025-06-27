import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('reset')
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  // 📩 Étape 1 — Envoyer le lien de réinitialisation
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    try {
      await this.resetService.forgotPassword(dto);
      return { message: 'Si cet email existe, un lien a été envoyé.' };
    } catch (error) {
      throw new BadRequestException('Erreur lors de l’envoi du mail.');
    }
  }

  // 🔐 Étape 2 — Réinitialiser le mot de passe
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.resetService.resetPassword(dto);
    return { message: 'Mot de passe réinitialisé avec succès.' };
  }
}
