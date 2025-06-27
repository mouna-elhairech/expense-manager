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
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const Depenses_1 = require("../../entities/entities/Depenses");
const NlpCategorization_1 = require("../../entities/entities/NlpCategorization");
let Category = class Category {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { name: 'nom', length: 100 }),
    __metadata("design:type", String)
], Category.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { name: 'icone', nullable: true, length: 100 }),
    __metadata("design:type", Object)
], Category.prototype, "icone", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', {
        name: 'limite_budget',
        nullable: true,
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Object)
], Category.prototype, "limiteBudget", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Depenses_1.Depenses, (dep) => dep.categorie),
    __metadata("design:type", Array)
], Category.prototype, "depenses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => NlpCategorization_1.NlpCategorization, (nlp) => nlp.categorieProposee),
    __metadata("design:type", Array)
], Category.prototype, "nlpCategorizations", void 0);
Category = __decorate([
    (0, typeorm_1.Index)('categories_pkey', ['id'], { unique: true }),
    (0, typeorm_1.Entity)('categories', { schema: 'public' })
], Category);
exports.Category = Category;
//# sourceMappingURL=category.entity.js.map