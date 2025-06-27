import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.error('❌ RESEND_API_KEY manquant dans .env');
      throw new Error('RESEND_API_KEY est requis');
    }

    this.resend = new Resend(apiKey);
  }

  async send(to: string, subject: string, html: string) {
    try {
      const response = await this.resend.emails.send({
        from: this.configService.get('RESEND_FROM') || 'noreply@expense-manager.dev',
        to,
        subject,
        html,
      });

      this.logger.log(`📤 Email envoyé à ${to}`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi email à ${to}`, error);
      throw new Error('Échec de l’envoi de l’email.');
    }
  }

  async sendResetPasswordEmail(to: string, resetLink: string, prenom?: string) {
    const name = prenom || 'utilisateur';

    const html = `
      <p>Bonjour ${name},</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous :</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Ce lien est valide pendant 30 minutes.</p>
      <p>Si vous n'avez pas demandé cela, ignorez ce message.</p>
    `;

    return this.send(to, '🔐 Réinitialisation de votre mot de passe', html);
  }
}
