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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return null;
        const isPasswordValid = await bcrypt.compare(password, user.motDePasse);
        if (!isPasswordValid)
            return null;
        const { motDePasse, ...result } = user;
        return result;
    }
    async login(user) {
        const fullUser = await this.usersService.findByEmailWithRoles(user.email);
        if (!fullUser) {
            throw new common_1.UnauthorizedException('Utilisateur introuvable');
        }
        const roleNames = fullUser.userRoles?.map((ur) => ur.role?.nom).filter(Boolean) || [];
        const payload = {
            sub: fullUser.id,
            email: fullUser.email,
            roles: roleNames,
        };
        console.log('🧪 PAYLOAD JWT =', payload);
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: fullUser.id,
                email: fullUser.email,
                nom: fullUser.nom,
                prenom: fullUser.prenom,
                roles: roleNames,
            },
        };
    }
    async changePassword(userId, dto) {
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        const isMatch = await bcrypt.compare(dto.oldPassword, user.motDePasse);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Ancien mot de passe incorrect');
        const hashedNew = await bcrypt.hash(dto.newPassword, 10);
        user.motDePasse = hashedNew;
        await this.usersService.save(user);
        return { message: 'Mot de passe modifié avec succès.' };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map