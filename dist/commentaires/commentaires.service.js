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
exports.CommentairesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Commentaires_1 = require("../entities/entities/Commentaires");
const Depenses_1 = require("../entities/entities/Depenses");
const Users_1 = require("../entities/entities/Users");
const notifications_service_1 = require("../notifications/notifications.service");
const notifications_1 = require("../entities/entities/notifications");
const crypto_1 = require("crypto");
let CommentairesService = class CommentairesService {
    constructor(commentRepository, depenseRepository, usersRepository, notificationsService) {
        this.commentRepository = commentRepository;
        this.depenseRepository = depenseRepository;
        this.usersRepository = usersRepository;
        this.notificationsService = notificationsService;
    }
    async create(dto, userId) {
        const { contenu, entityId, entityType = 'EXPENSE' } = dto;
        if (!contenu || contenu.trim() === '') {
            throw new common_1.BadRequestException('Le contenu du commentaire est requis.');
        }
        const utilisateur = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!utilisateur) {
            throw new common_1.BadRequestException('Utilisateur introuvable.');
        }
        const commentaire = this.commentRepository.create({
            id: (0, crypto_1.randomUUID)(),
            contenu,
            entityId,
            entityType,
            utilisateur,
            dateCreation: new Date(),
            dateMiseAJour: new Date(),
        });
        const saved = await this.commentRepository.save(commentaire);
        if (entityType === 'EXPENSE') {
            const depense = await this.depenseRepository.findOne({
                where: { id: entityId },
                relations: ['user'],
            });
            if (depense && depense.user?.id !== userId) {
                const fullName = `${utilisateur.prenom ?? ''} ${utilisateur.nom ?? ''}`.trim();
                await this.notificationsService.create(depense.user.id, notifications_1.NotificationType.COMMENT, `💬 ${fullName} a commenté votre dépense`, `/expenses/${entityId}#comment-${saved.id}`);
            }
        }
        return saved;
    }
    async findByEntityId(entityId) {
        return this.commentRepository.find({
            where: { entityId },
            relations: ['utilisateur'],
            order: { dateCreation: 'ASC' },
        });
    }
    async delete(id) {
        const result = await this.commentRepository.delete(id);
        return !!result.affected && result.affected > 0;
    }
    async findById(id) {
        return this.commentRepository.findOne({
            where: { id },
            relations: ['utilisateur'],
        });
    }
};
CommentairesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Commentaires_1.Commentaires)),
    __param(1, (0, typeorm_1.InjectRepository)(Depenses_1.Depenses)),
    __param(2, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], CommentairesService);
exports.CommentairesService = CommentairesService;
//# sourceMappingURL=commentaires.service.js.map