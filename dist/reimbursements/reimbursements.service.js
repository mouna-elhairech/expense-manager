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
exports.ReimbursementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ReimbursementRequest_1 = require("../entities/entities/ReimbursementRequest");
const Depenses_1 = require("../entities/entities/Depenses");
const Users_1 = require("../entities/entities/Users");
const notifications_service_1 = require("../notifications/notifications.service");
const notifications_1 = require("../entities/entities/notifications");
let ReimbursementsService = class ReimbursementsService {
    constructor(reimbursementRepo, depenseRepo, userRepo, notificationsService) {
        this.reimbursementRepo = reimbursementRepo;
        this.depenseRepo = depenseRepo;
        this.userRepo = userRepo;
        this.notificationsService = notificationsService;
    }
    async create(dto, userId) {
        const { depenses: depenseIds, notes } = dto;
        if (!depenseIds || depenseIds.length === 0) {
            throw new common_1.NotFoundException('Aucune dépense sélectionnée.');
        }
        const selectedDepenses = await this.depenseRepo
            .createQueryBuilder('depense')
            .leftJoinAndSelect('depense.user', 'user')
            .where('depense.id IN (:...ids)', { ids: depenseIds })
            .andWhere('user.id = :userId', { userId })
            .andWhere('depense.statut = :statut', { statut: Depenses_1.StatutDepense.SUBMITTED })
            .andWhere('depense.reimbursementRequest IS NULL')
            .getMany();
        if (selectedDepenses.length === 0) {
            throw new common_1.NotFoundException('Aucune dépense valide trouvée.');
        }
        const total = selectedDepenses.reduce((sum, d) => sum + Number(d.montant), 0);
        const newRequest = this.reimbursementRepo.create({
            montantTotal: total,
            notes,
            statut: ReimbursementRequest_1.ReimbursementStatus.PENDING,
            dateCreation: new Date(),
            depenses: selectedDepenses,
        });
        const savedRequest = await this.reimbursementRepo.save(newRequest);
        for (const dep of selectedDepenses) {
            dep.reimbursementRequest = savedRequest;
            await this.depenseRepo.save(dep);
        }
        const employe = await this.userRepo.findOne({ where: { id: userId } });
        const fullName = `${employe?.prenom || ''} ${employe?.nom || ''}`.trim();
        const managers = await this.userRepo
            .createQueryBuilder('user')
            .leftJoin('user.roles', 'role')
            .where('role.nom = :roleName', { roleName: 'MANAGER' })
            .getMany();
        for (const manager of managers) {
            await this.notificationsService.create(manager.id, notifications_1.NotificationType.REIMBURSEMENT, ` Nouvelle demande de remboursement soumise par ${fullName}`, `/reimbursements/${savedRequest.id}`);
        }
        return savedRequest;
    }
    async findAll() {
        return this.reimbursementRepo.find({
            relations: ['depenses', 'depenses.user'],
            order: { dateCreation: 'DESC' },
        });
    }
    async findMine(userId) {
        return this.reimbursementRepo
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.depenses', 'd')
            .where('d.user.id = :userId', { userId })
            .orderBy('r.dateCreation', 'DESC')
            .getMany();
    }
    async findOne(id) {
        const found = await this.reimbursementRepo.findOne({
            where: { id },
            relations: ['depenses'],
        });
        if (!found)
            throw new common_1.NotFoundException('Demande non trouvée');
        return found;
    }
    async update(id, dto) {
        const request = await this.reimbursementRepo.findOne({
            where: { id },
            relations: ['depenses', 'depenses.user'],
        });
        if (!request)
            throw new common_1.NotFoundException('Demande non trouvée');
        Object.assign(request, dto);
        const updated = await this.reimbursementRepo.save(request);
        if (dto.statut === ReimbursementRequest_1.ReimbursementStatus.APPROVED ||
            dto.statut === ReimbursementRequest_1.ReimbursementStatus.REJECTED) {
            const employee = request.depenses[0]?.user;
            if (!dto.approvedBy) {
                throw new common_1.NotFoundException('approvedBy manquant');
            }
            const manager = await this.userRepo.findOne({
                where: { id: dto.approvedBy },
            });
            if (!manager) {
                throw new common_1.NotFoundException(`Manager avec l'ID ${dto.approvedBy} introuvable`);
            }
            const fullManager = `${manager.prenom || ''} ${manager.nom || ''}`.trim();
            const notificationType = dto.statut === ReimbursementRequest_1.ReimbursementStatus.APPROVED
                ? notifications_1.NotificationType.APPROVAL
                : notifications_1.NotificationType.REJECTION;
            const message = dto.statut === ReimbursementRequest_1.ReimbursementStatus.APPROVED
                ? ` Votre demande a été approuvée par ${fullManager}`
                : ` Votre demande a été rejetée par ${fullManager}`;
            if (employee?.id) {
                await this.notificationsService.create(employee.id, notificationType, message, `/reimbursements/${updated.id}`);
            }
            for (const dep of request.depenses) {
                dep.statut =
                    dto.statut === ReimbursementRequest_1.ReimbursementStatus.APPROVED
                        ? Depenses_1.StatutDepense.APPROVED
                        : Depenses_1.StatutDepense.REJECTED;
                await this.depenseRepo.save(dep);
            }
        }
        return updated;
    }
    async remove(id) {
        const request = await this.reimbursementRepo.findOneBy({ id });
        if (!request)
            throw new common_1.NotFoundException('Demande non trouvée');
        return this.reimbursementRepo.remove(request);
    }
};
ReimbursementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ReimbursementRequest_1.ReimbursementRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(Depenses_1.Depenses)),
    __param(2, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService])
], ReimbursementsService);
exports.ReimbursementsService = ReimbursementsService;
//# sourceMappingURL=reimbursements.service.js.map