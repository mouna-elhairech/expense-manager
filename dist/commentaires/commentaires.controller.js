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
exports.CommentairesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const commentaires_service_1 = require("./commentaires.service");
const create_commentaire_dto_1 = require("./dto/create-commentaire.dto");
let CommentairesController = class CommentairesController {
    constructor(commentairesService) {
        this.commentairesService = commentairesService;
    }
    async create(body, req) {
        const userId = req.user?.id;
        return this.commentairesService.create(body, userId);
    }
    async findByEntity(entityId, entityType) {
        if (!entityId)
            throw new common_1.NotFoundException('entityId requis');
        return this.commentairesService.findByEntityId(entityId);
    }
    async remove(id, req) {
        const userId = req.user?.id;
        const commentaire = await this.commentairesService.findById(id);
        if (!commentaire)
            throw new common_1.NotFoundException('Commentaire introuvable');
        if (commentaire.utilisateur?.id !== userId)
            throw new common_1.ForbiddenException('Vous ne pouvez supprimer que vos propres commentaires');
        await this.commentairesService.delete(id);
        return { message: 'Commentaire supprimé' };
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_commentaire_dto_1.CreateCommentaireDto, Object]),
    __metadata("design:returntype", Promise)
], CommentairesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('entityId')),
    __param(1, (0, common_1.Query)('entityType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommentairesController.prototype, "findByEntity", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CommentairesController.prototype, "remove", null);
CommentairesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('commentaires'),
    __metadata("design:paramtypes", [commentaires_service_1.CommentairesService])
], CommentairesController);
exports.CommentairesController = CommentairesController;
//# sourceMappingURL=commentaires.controller.js.map