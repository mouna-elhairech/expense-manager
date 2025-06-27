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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentaireDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCommentaireDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'ID de l\'entité est requis' }),
    (0, class_validator_1.IsUUID)('4', { message: 'L\'ID de l\'entité doit être un UUID valide' }),
    __metadata("design:type", String)
], CreateCommentaireDto.prototype, "entityId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Le contenu du commentaire est requis' }),
    (0, class_validator_1.IsString)({ message: 'Le contenu doit être une chaîne de caractères' }),
    __metadata("design:type", String)
], CreateCommentaireDto.prototype, "contenu", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Le type d\'entité est requis' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['EXPENSE', 'REIMBURSEMENT_REQUEST'], {
        message: 'Le type d\'entité doit être EXPENSE ou REIMBURSEMENT_REQUEST',
    }),
    __metadata("design:type", String)
], CreateCommentaireDto.prototype, "entityType", void 0);
exports.CreateCommentaireDto = CreateCommentaireDto;
//# sourceMappingURL=create-commentaire.dto.js.map