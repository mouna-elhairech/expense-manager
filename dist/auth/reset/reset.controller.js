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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetController = void 0;
const common_1 = require("@nestjs/common");
const reset_service_1 = require("./reset.service");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
let ResetController = class ResetController {
    constructor(resetService) {
        this.resetService = resetService;
    }
    async forgotPassword(dto) {
        try {
            await this.resetService.forgotPassword(dto);
            return { message: 'Si cet email existe, un lien a été envoyé.' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Erreur lors de l’envoi du mail.');
        }
    }
    async resetPassword(dto) {
        await this.resetService.resetPassword(dto);
        return { message: 'Mot de passe réinitialisé avec succès.' };
    }
};
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], ResetController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], ResetController.prototype, "resetPassword", null);
ResetController = __decorate([
    (0, common_1.Controller)('reset'),
    __metadata("design:paramtypes", [reset_service_1.ResetService])
], ResetController);
exports.ResetController = ResetController;
//# sourceMappingURL=reset.controller.js.map