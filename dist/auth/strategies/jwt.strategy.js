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
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Users_1 = require("../../entities/entities/Users");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, usersRepository) {
        const jwtSecret = configService.get('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('❌ JWT_SECRET non défini dans le fichier .env');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
        this.configService = configService;
        this.usersRepository = usersRepository;
        this.logger = new common_1.Logger(JwtStrategy_1.name);
        const masked = jwtSecret.substring(0, 3) + '...' + jwtSecret.slice(-3);
        this.logger.log(`✅ JWT_SECRET utilisé par le backend = ${jwtSecret}`);
        this.logger.log(`🔒 JWT strategy initialized with secret: ${masked}`);
    }
    async validate(payload) {
        this.logger.log(`🔐 Payload JWT reçu : ${JSON.stringify(payload)}`);
        const user = await this.usersRepository.findOne({
            where: { id: payload.sub },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user) {
            this.logger.error('❌ Utilisateur introuvable en base');
            throw new common_1.UnauthorizedException('Token invalide ou utilisateur inexistant');
        }
        return {
            id: user.id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            roles: user.userRoles.map((ur) => ur.role?.nom),
        };
    }
};
JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;
//# sourceMappingURL=jwt.strategy.js.map