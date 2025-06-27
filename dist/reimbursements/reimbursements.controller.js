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
exports.ReimbursementsController = void 0;
const common_1 = require("@nestjs/common");
const reimbursements_service_1 = require("./reimbursements.service");
const create_reimbursement_dto_1 = require("./dto/create-reimbursement.dto");
const update_reimbursement_dto_1 = require("./dto/update-reimbursement.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
let ReimbursementsController = class ReimbursementsController {
    constructor(reimbursementsService) {
        this.reimbursementsService = reimbursementsService;
    }
    create(req, dto) {
        const userId = req.user?.id;
        return this.reimbursementsService.create(dto, userId);
    }
    findAll() {
        return this.reimbursementsService.findAll();
    }
    findMine(req) {
        const userId = req.user?.id;
        return this.reimbursementsService.findMine(userId);
    }
    findOne(id) {
        return this.reimbursementsService.findOne(id);
    }
    update(id, dto) {
        return this.reimbursementsService.update(id, dto);
    }
    remove(id) {
        return this.reimbursementsService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('EMPLOYEE'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_reimbursement_dto_1.CreateReimbursementDto]),
    __metadata("design:returntype", void 0)
], ReimbursementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('MANAGER'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReimbursementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)('EMPLOYEE'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReimbursementsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('EMPLOYEE', 'MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReimbursementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reimbursement_dto_1.UpdateReimbursementDto]),
    __metadata("design:returntype", void 0)
], ReimbursementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('MANAGER'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReimbursementsController.prototype, "remove", null);
ReimbursementsController = __decorate([
    (0, common_1.Controller)('reimbursements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reimbursements_service_1.ReimbursementsService])
], ReimbursementsController);
exports.ReimbursementsController = ReimbursementsController;
//# sourceMappingURL=reimbursements.controller.js.map