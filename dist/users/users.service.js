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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const Users_1 = require("../entities/entities/Users");
const UserRoles_1 = require("../entities/entities/UserRoles");
const roles_service_1 = require("../roles/roles.service");
let UsersService = class UsersService {
    constructor(usersRepository, userRolesRepository, rolesService) {
        this.usersRepository = usersRepository;
        this.userRolesRepository = userRolesRepository;
        this.rolesService = rolesService;
    }
    async create(createUserDto) {
        const { password, roleIds, ...userData } = createUserDto;
        const userId = (0, crypto_1.randomUUID)();
        const newUser = new Users_1.Users();
        newUser.id = userId;
        newUser.email = userData.email;
        newUser.prenom = userData.firstName;
        newUser.nom = userData.lastName;
        newUser.motDePasse = this.isBcryptHash(password)
            ? password
            : await bcrypt.hash(password, 10);
        const now = new Date();
        newUser.dateCreation = now;
        newUser.dateMiseAJour = now;
        const savedUser = await this.usersRepository.save(newUser);
        if (roleIds && roleIds.length > 0) {
            await this.assignRolesToUser(userId, roleIds);
        }
        return this.findOne(userId);
    }
    isBcryptHash(value) {
        return typeof value === 'string' && /^\$2[abxy]?\$[0-9]{2}\$/.test(value);
    }
    async assignRolesToUser(userId, roleIds) {
        for (const roleId of roleIds) {
            const userRole = new UserRoles_1.UserRoles();
            userRole.id = (0, crypto_1.randomUUID)();
            userRole.userId = userId;
            userRole.roleId = roleId.toString();
            const now = new Date();
            userRole.dateCreation = now;
            userRole.dateMiseAJour = now;
            await this.userRolesRepository.save(userRole);
        }
    }
    async findAll() {
        return this.usersRepository.find({
            relations: ['userRoles', 'userRoles.role'],
            order: { dateCreation: 'DESC' },
        });
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
        }
        return user;
    }
    async save(user) {
        return this.usersRepository.save(user);
    }
    async findByEmail(email) {
        const user = await this.usersRepository.findOne({
            where: { email },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async findByEmailWithRoles(email) {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['userRoles', 'userRoles.role'],
            select: {
                id: true,
                email: true,
                prenom: true,
                nom: true,
                motDePasse: true,
            },
        });
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        const { password, roleIds, ...userData } = updateUserDto;
        if (userData.email)
            user.email = userData.email;
        if (userData.firstName)
            user.prenom = userData.firstName;
        if (userData.lastName)
            user.nom = userData.lastName;
        if (password) {
            user.motDePasse = this.isBcryptHash(password)
                ? password
                : await bcrypt.hash(password, 10);
        }
        user.dateMiseAJour = new Date();
        await this.usersRepository.save(user);
        if (roleIds && roleIds.length > 0) {
            await this.userRolesRepository.delete({ userId: id });
            await this.assignRolesToUser(id, roleIds);
        }
        return this.findOne(id);
    }
    async remove(id) {
        await this.userRolesRepository.delete({ userId: id });
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
    async countUsers() {
        return this.usersRepository.count();
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(UserRoles_1.UserRoles)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        roles_service_1.RolesService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map