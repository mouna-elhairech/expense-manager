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
exports.OcrProcessing = void 0;
const typeorm_1 = require("typeorm");
const NlpCategorization_1 = require("./NlpCategorization");
const Recus_1 = require("./Recus");
let OcrProcessing = class OcrProcessing {
};
__decorate([
    (0, typeorm_1.Column)('uuid', { primary: true, name: 'id' }),
    __metadata("design:type", String)
], OcrProcessing.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        name: 'niveau_confiance',
        nullable: true,
        precision: 5,
        scale: 4,
    }),
    __metadata("design:type", Object)
], OcrProcessing.prototype, "niveauConfiance", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { name: 'donnees_extraites', nullable: true }),
    __metadata("design:type", Object)
], OcrProcessing.prototype, "donneesExtraites", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'texte_extrait', nullable: true }),
    __metadata("design:type", Object)
], OcrProcessing.prototype, "texteExtrait", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'details_erreur', nullable: true }),
    __metadata("design:type", Object)
], OcrProcessing.prototype, "detailsErreur", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'date_creation' }),
    __metadata("design:type", Date)
], OcrProcessing.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'date_mise_a_jour' }),
    __metadata("design:type", Date)
], OcrProcessing.prototype, "dateMiseAJour", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => NlpCategorization_1.NlpCategorization, (nlpCategorization) => nlpCategorization.ocrProcessing, { cascade: true }),
    __metadata("design:type", Array)
], OcrProcessing.prototype, "nlpCategorizations", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Recus_1.Recus, (recu) => recu.ocrProcessing),
    (0, typeorm_1.JoinColumn)({ name: 'recu_id' }),
    __metadata("design:type", Recus_1.Recus)
], OcrProcessing.prototype, "recu", void 0);
OcrProcessing = __decorate([
    (0, typeorm_1.Index)('ocr_processing_pkey', ['id'], { unique: true }),
    (0, typeorm_1.Entity)('ocr_processing', { schema: 'public' })
], OcrProcessing);
exports.OcrProcessing = OcrProcessing;
//# sourceMappingURL=OcrProcessing.js.map