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
exports.Notifications = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
var NotificationType;
(function (NotificationType) {
    NotificationType["APPROVAL"] = "APPROVAL";
    NotificationType["REJECTION"] = "REJECTION";
    NotificationType["REIMBURSEMENT"] = "REIMBURSEMENT";
    NotificationType["REMINDER"] = "REMINDER";
    NotificationType["COMMENT"] = "COMMENT";
})(NotificationType = exports.NotificationType || (exports.NotificationType = {}));
let Notifications = class Notifications {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Notifications.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: NotificationType, name: "type" }),
    __metadata("design:type", String)
], Notifications.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "contenu" }),
    __metadata("design:type", String)
], Notifications.prototype, "contenu", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "est_lue" }),
    __metadata("design:type", Boolean)
], Notifications.prototype, "estLue", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "date_creation" }),
    __metadata("design:type", Date)
], Notifications.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "date_lecture", nullable: true }),
    __metadata("design:type", Object)
], Notifications.prototype, "dateLecture", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "target_url", nullable: true }),
    __metadata("design:type", Object)
], Notifications.prototype, "targetUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.notifications, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "user_id", referencedColumnName: "id" }]),
    __metadata("design:type", Users_1.Users)
], Notifications.prototype, "user", void 0);
Notifications = __decorate([
    (0, typeorm_1.Index)("notifications_pkey", ["id"], { unique: true }),
    (0, typeorm_1.Entity)("notifications", { schema: "public" })
], Notifications);
exports.Notifications = Notifications;
//# sourceMappingURL=notifications.js.map