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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notifications_1 = require("../entities/entities/notifications");
const Users_1 = require("../entities/entities/Users");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository, usersRepository) {
        this.notificationRepository = notificationRepository;
        this.usersRepository = usersRepository;
    }
    async create(userId, type, contenu, targetUrl = null) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        const notification = this.notificationRepository.create({
            user,
            type,
            contenu,
            estLue: false,
            dateCreation: new Date(),
            dateLecture: null,
            targetUrl,
        });
        return this.notificationRepository.save(notification);
    }
    async findByUser(userId) {
        return this.notificationRepository.find({
            where: { user: { id: userId } },
            order: { dateCreation: 'DESC' },
        });
    }
    async markAsRead(id) {
        const notif = await this.notificationRepository.findOne({ where: { id } });
        if (!notif)
            throw new common_1.NotFoundException('Notification non trouvée');
        notif.estLue = true;
        notif.dateLecture = new Date();
        return this.notificationRepository.save(notif);
    }
};
NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notifications_1.Notifications)),
    __param(1, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map