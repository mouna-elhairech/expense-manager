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
exports.Recus = void 0;
const typeorm_1 = require("typeorm");
const Depenses_1 = require("./Depenses");
const OcrProcessing_1 = require("./OcrProcessing");
let Recus = class Recus {
};
__decorate([
    (0, typeorm_1.Column)("uuid", { primary: true, name: "id" }),
    __metadata("design:type", String)
], Recus.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "nom_fichier", length: 255 }),
    __metadata("design:type", String)
], Recus.prototype, "nomFichier", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "chemin_stockage", length: 255 }),
    __metadata("design:type", String)
], Recus.prototype, "cheminStockage", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", {
        name: "montant",
        nullable: true,
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Object)
], Recus.prototype, "montant", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "fournisseur", nullable: true }),
    __metadata("design:type", Object)
], Recus.prototype, "fournisseur", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "date", nullable: true }),
    __metadata("design:type", Object)
], Recus.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "est_traite", nullable: true }),
    __metadata("design:type", Object)
], Recus.prototype, "estTraite", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "date_creation" }),
    __metadata("design:type", Date)
], Recus.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "date_mise_a_jour" }),
    __metadata("design:type", Date)
], Recus.prototype, "dateMiseAJour", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Depenses_1.Depenses, (depenses) => depenses.recu),
    __metadata("design:type", Array)
], Recus.prototype, "depenses", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => OcrProcessing_1.OcrProcessing, (ocr) => ocr.recu, {
        cascade: true,
        nullable: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'ocr_processing_id' }),
    __metadata("design:type", OcrProcessing_1.OcrProcessing)
], Recus.prototype, "ocrProcessing", void 0);
Recus = __decorate([
    (0, typeorm_1.Index)("recus_pkey", ["id"], { unique: true }),
    (0, typeorm_1.Entity)("recus", { schema: "public" })
], Recus);
exports.Recus = Recus;
//# sourceMappingURL=Recus.js.map