"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (!apiKey) {
            this.logger.error('❌ RESEND_API_KEY manquant dans .env');
            throw new Error('RESEND_API_KEY est requis');
        }
        this.resend = new resend_1.Resend(apiKey);
    }
    async send(to, subject, html) {
        try {
            const response = await this.resend.emails.send({
                from: this.configService.get('RESEND_FROM') || 'noreply@expense-manager.dev',
                to,
                subject,
                html,
            });
            this.logger.log(`📤 Email envoyé à ${to}`);
            return response;
        }
        catch (error) {
            this.logger.error(`❌ Erreur envoi email à ${to}`, error);
            throw new Error('Échec de l’envoi de l’email.');
        }
    }
    async sendResetPasswordEmail(to, resetLink, prenom) {
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
};
EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map