import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private resend;
    private readonly logger;
    constructor(configService: ConfigService);
    send(to: string, subject: string, html: string): Promise<import("resend").CreateEmailResponse>;
    sendResetPasswordEmail(to: string, resetLink: string, prenom?: string): Promise<import("resend").CreateEmailResponse>;
}
