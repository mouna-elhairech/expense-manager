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
exports.ReimbursementRequest = exports.ReimbursementStatus = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const Depenses_1 = require("./Depenses");
var ReimbursementStatus;
(function (ReimbursementStatus) {
    ReimbursementStatus["PENDING"] = "PENDING";
    ReimbursementStatus["APPROVED"] = "APPROVED";
    ReimbursementStatus["REJECTED"] = "REJECTED";
})(ReimbursementStatus = exports.ReimbursementStatus || (exports.ReimbursementStatus = {}));
let ReimbursementRequest = class ReimbursementRequest {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReimbursementRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReimbursementStatus,
        enumName: 'reimbursement_status_enum',
        default: ReimbursementStatus.PENDING,
    }),
    __metadata("design:type", String)
], ReimbursementRequest.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { name: 'montant_total', default: 0 }),
    __metadata("design:type", Number)
], ReimbursementRequest.prototype, "montantTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReimbursementRequest.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", Users_1.Users)
], ReimbursementRequest.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_creation' }),
    __metadata("design:type", Date)
], ReimbursementRequest.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_approbation', type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], ReimbursementRequest.prototype, "dateApprobation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Depenses_1.Depenses, (depense) => depense.reimbursementRequest),
    __metadata("design:type", Array)
], ReimbursementRequest.prototype, "depenses", void 0);
ReimbursementRequest = __decorate([
    (0, typeorm_1.Entity)('reimbursement_request', { schema: 'public' })
], ReimbursementRequest);
exports.ReimbursementRequest = ReimbursementRequest;
//# sourceMappingURL=ReimbursementRequest.js.map