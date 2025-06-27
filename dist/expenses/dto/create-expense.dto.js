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
exports.CreateExpenseDto = void 0;
const class_validator_1 = require("class-validator");
const Depenses_1 = require("../../entities/entities/Depenses");
class CreateExpenseDto {
}
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Le montant doit être un nombre.' }),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "montant", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La devise est requise (ex: EUR, USD).' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "devise", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'La date de dépense doit être au format ISO.' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "dateDepense", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La description est obligatoire.' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Depenses_1.StatutDepense, {
        message: 'Le statut doit être l’un des suivants : SUBMITTED, APPROVED, REJECTED, REIMBURSED',
    }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "statut", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'L’ID de catégorie doit être un UUID valide.' }),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "categorieId", void 0);
exports.CreateExpenseDto = CreateExpenseDto;
//# sourceMappingURL=create-expense.dto.js.map