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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Roles_1 = require("../entities/entities/Roles");
const crypto_1 = require("crypto");
let RolesService = class RolesService {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    async create(createRoleDto) {
        const role = this.roleRepository.create({
            id: (0, crypto_1.randomUUID)(),
            nom: createRoleDto.name,
            dateCreation: new Date(),
            dateMiseAJour: new Date()
        });
        return this.roleRepository.save(role);
    }
    async findAll() {
        return this.roleRepository.find();
    }
    async findOne(id) {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }
    async findByIds(ids) {
        if (!ids || ids.length === 0)
            return [];
        return this.roleRepository.findByIds(ids);
    }
    async update(id, updateRoleDto) {
        const role = await this.findOne(id);
        if (updateRoleDto.name) {
            role.nom = updateRoleDto.name;
        }
        role.dateMiseAJour = new Date();
        return this.roleRepository.save(role);
    }
    async remove(id) {
        const role = await this.findOne(id);
        await this.roleRepository.remove(role);
    }
    async findByName(name) {
        const upperCaseName = name.toUpperCase();
        const role = await this.roleRepository.findOne({ where: { nom: upperCaseName } });
        if (!role) {
            throw new common_1.NotFoundException(`Role with name ${name} not found`);
        }
        return role;
    }
    async ensureBasicRolesExist() {
        const defaultRoles = [
            {
                id: (0, crypto_1.randomUUID)(),
                nom: 'ADMIN',
                dateCreation: new Date(),
                dateMiseAJour: new Date()
            },
            {
                id: (0, crypto_1.randomUUID)(),
                nom: 'MANAGER',
                dateCreation: new Date(),
                dateMiseAJour: new Date()
            },
            {
                id: (0, crypto_1.randomUUID)(),
                nom: 'USER',
                dateCreation: new Date(),
                dateMiseAJour: new Date()
            },
        ];
        try {
            const existingRoles = await this.findAll();
            for (const defaultRole of defaultRoles) {
                const roleExists = existingRoles.some(role => role.nom === defaultRole.nom);
                if (!roleExists) {
                    await this.roleRepository.save(defaultRole);
                    console.log(`Created default role: ${defaultRole.nom}`);
                }
            }
        }
        catch (error) {
            console.error('Error initializing roles:', error);
        }
    }
};
RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Roles_1.Roles)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
exports.RolesService = RolesService;
//# sourceMappingURL=roles.service.js.map