"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Users_1 = require("../../entities/entities/Users");
const ResetToken_1 = require("../../entities/entities/ResetToken");
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcrypt"));
const email_service_1 = require("../../common/services/email.service");
let ResetService = class ResetService {
    constructor(userRepo, resetTokenRepo, emailService) {
        this.userRepo = userRepo;
        this.resetTokenRepo = resetTokenRepo;
        this.emailService = emailService;
    }
    async forgotPassword(dto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user)
            return;
        const token = crypto.randomBytes(32).toString('hex');
        const expiration = new Date(Date.now() + 1000 * 60 * 30);
        const reset = this.resetTokenRepo.create({
            token,
            user,
            user_id: user.id,
            expiresAt: expiration,
        });
        await this.resetTokenRepo.save(reset);
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        await this.emailService.sendResetPasswordEmail(user.email, resetLink, user.prenom);
    }
    async resetPassword(dto) {
        const { token, newPassword, confirmPassword } = dto;
        if (newPassword !== confirmPassword) {
            throw new common_1.BadRequestException('Les mots de passe ne correspondent pas.');
        }
        const tokenRecord = await this.resetTokenRepo.findOne({
            where: {
                token,
                used: false,
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            },
            relations: ['user'],
        });
        if (!tokenRecord) {
            throw new common_1.BadRequestException('Lien invalide ou expiré.');
        }
        const user = tokenRecord.user;
        user.motDePasse = await bcrypt.hash(newPassword, 10);
        await this.userRepo.save(user);
        tokenRecord.used = true;
        await this.resetTokenRepo.save(tokenRecord);
    }
    async cleanExpiredTokens() {
        await this.resetTokenRepo.delete({ expiresAt: (0, typeorm_2.LessThan)(new Date()) });
    }
};
ResetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(ResetToken_1.ResetToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], ResetService);
exports.ResetService = ResetService;
//# sourceMappingURL=reset.service.js.map