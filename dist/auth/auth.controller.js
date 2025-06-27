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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const auth_service_1 = require("./auth.service");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
const roles_service_1 = require("../roles/roles.service");
const forgot_password_dto_1 = require("./reset/dto/forgot-password.dto");
const reset_password_dto_1 = require("./reset/dto/reset-password.dto");
const reset_service_1 = require("./reset/reset.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const change_password_dto_1 = require("./dto/change-password.dto");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService, usersService, rolesService, resetService) {
        this.authService = authService;
        this.usersService = usersService;
        this.rolesService = rolesService;
        this.resetService = resetService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async login(req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(req.user);
    }
    async forgotPassword(dto) {
        await this.resetService.forgotPassword(dto);
        return { message: 'Si cet email existe, un lien a été envoyé.' };
    }
    async resetPassword(dto) {
        await this.resetService.resetPassword(dto);
        return { message: 'Mot de passe mis à jour avec succès.' };
    }
    async createAdmin() {
        const email = 'mouna@admin.com';
        const password = 'manani';
        const existing = await this.usersService.findByEmail(email).catch(() => null);
        if (existing) {
            return { message: 'Admin déjà existant', id: existing.id };
        }
        const hashed = await bcrypt.hash(password, 10);
        const role = await this.rolesService.findByName('ADMIN');
        const user = await this.usersService.create({
            email,
            password: hashed,
            firstName: 'Mouna',
            lastName: 'Admin',
            roleIds: [role.id],
        });
        return {
            message: 'Admin créé avec succès',
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
    async createTestUser() {
        const email = 'test@example.com';
        const existing = await this.usersService.findByEmail(email).catch(() => null);
        if (existing) {
            return { message: 'Utilisateur test déjà existant', id: existing.id };
        }
        const hashed = await bcrypt.hash('password123', 10);
        const user = await this.usersService.create({
            email,
            password: hashed,
            firstName: 'Test',
            lastName: 'User',
        });
        return {
            message: 'Utilisateur test créé avec succès',
            id: user.id,
        };
    }
    async changePassword(req, dto) {
        return this.authService.changePassword(req.user.id, dto);
    }
};
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('create-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Post)('create-test-user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createTestUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('change-password'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        roles_service_1.RolesService,
        reset_service_1.ResetService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map