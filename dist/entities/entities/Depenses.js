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
exports.Depenses = exports.StatutDepense = void 0;
const typeorm_1 = require("typeorm");
const Recus_1 = require("./Recus");
const Users_1 = require("./Users");
const category_entity_1 = require("../../categories/entities/category.entity");
const NlpCategorization_1 = require("./NlpCategorization");
const ReimbursementRequest_1 = require("./ReimbursementRequest");
var StatutDepense;
(function (StatutDepense) {
    StatutDepense["SUBMITTED"] = "SUBMITTED";
    StatutDepense["APPROVED"] = "APPROVED";
    StatutDepense["REJECTED"] = "REJECTED";
    StatutDepense["REIMBURSED"] = "REIMBURSED";
})(StatutDepense = exports.StatutDepense || (exports.StatutDepense = {}));
let Depenses = class Depenses {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Depenses.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { name: 'montant', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Depenses.prototype, "montant", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { name: 'devise', length: 3 }),
    __metadata("design:type", String)
], Depenses.prototype, "devise", void 0);
__decorate([
    (0, typeorm_1.Column)('date', { name: 'date_depense' }),
    __metadata("design:type", Date)
], Depenses.prototype, "dateDepense", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'description', nullable: true }),
    __metadata("design:type", Object)
], Depenses.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StatutDepense,
        enumName: 'depenses_statut_enum',
        default: StatutDepense.SUBMITTED,
    }),
    __metadata("design:type", String)
], Depenses.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'date_creation' }),
    __metadata("design:type", Date)
], Depenses.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'date_mise_a_jour' }),
    __metadata("design:type", Date)
], Depenses.prototype, "dateMiseAJour", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.depenses, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'categorie_id', referencedColumnName: 'id' }]),
    __metadata("design:type", category_entity_1.Category)
], Depenses.prototype, "categorie", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Recus_1.Recus, (recus) => recus.depenses, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'recu_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Recus_1.Recus)
], Depenses.prototype, "recu", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.depenses),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], Depenses.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => NlpCategorization_1.NlpCategorization, (nlp) => nlp.depense),
    __metadata("design:type", Array)
], Depenses.prototype, "nlpCategorizations", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ReimbursementRequest_1.ReimbursementRequest, (request) => request.depenses, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'reimbursement_request_id', referencedColumnName: 'id' }]),
    __metadata("design:type", ReimbursementRequest_1.ReimbursementRequest)
], Depenses.prototype, "reimbursementRequest", void 0);
Depenses = __decorate([
    (0, typeorm_1.Index)('depenses_pkey', ['id'], { unique: true }),
    (0, typeorm_1.Entity)('depenses', { schema: 'public' })
], Depenses);
exports.Depenses = Depenses;
//# sourceMappingURL=Depenses.js.map