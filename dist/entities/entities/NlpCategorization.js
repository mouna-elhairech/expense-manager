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
exports.NlpCategorization = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../categories/entities/category.entity");
const Depenses_1 = require("./Depenses");
const OcrProcessing_1 = require("./OcrProcessing");
let NlpCategorization = class NlpCategorization {
};
__decorate([
    (0, typeorm_1.Column)('uuid', { primary: true, name: 'id' }),
    __metadata("design:type", String)
], NlpCategorization.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        name: 'score_confiance',
        nullable: true,
        precision: 5,
        scale: 4,
    }),
    __metadata("design:type", Object)
], NlpCategorization.prototype, "scoreConfiance", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'date_analyse' }),
    __metadata("design:type", Date)
], NlpCategorization.prototype, "dateAnalyse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.nlpCategorizations, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'categorie_proposee_id', referencedColumnName: 'id' }]),
    __metadata("design:type", category_entity_1.Category)
], NlpCategorization.prototype, "categorieProposee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Depenses_1.Depenses, (depenses) => depenses.nlpCategorizations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'depense_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Depenses_1.Depenses)
], NlpCategorization.prototype, "depense", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => OcrProcessing_1.OcrProcessing, (ocr) => ocr.nlpCategorizations, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'ocr_processing_id', referencedColumnName: 'id' }]),
    __metadata("design:type", OcrProcessing_1.OcrProcessing)
], NlpCategorization.prototype, "ocrProcessing", void 0);
NlpCategorization = __decorate([
    (0, typeorm_1.Index)('nlp_categorization_pkey', ['id'], { unique: true }),
    (0, typeorm_1.Entity)('nlp_categorization', { schema: 'public' })
], NlpCategorization);
exports.NlpCategorization = NlpCategorization;
//# sourceMappingURL=NlpCategorization.js.map