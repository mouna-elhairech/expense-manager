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
exports.UserRoles = void 0;
const typeorm_1 = require("typeorm");
const Roles_1 = require("./Roles");
const Users_1 = require("./Users");
let UserRoles = class UserRoles {
};
__decorate([
    (0, typeorm_1.Column)("uuid", { primary: true, name: "id" }),
    __metadata("design:type", String)
], UserRoles.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid", { name: "user_id", unique: true }),
    __metadata("design:type", String)
], UserRoles.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid", { name: "role_id", unique: true }),
    __metadata("design:type", String)
], UserRoles.prototype, "roleId", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid", { name: "attribue_par", nullable: true }),
    __metadata("design:type", Object)
], UserRoles.prototype, "attribuePar", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "date_creation" }),
    __metadata("design:type", Date)
], UserRoles.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { name: 'date_mise_a_jour' }),
    __metadata("design:type", Date)
], UserRoles.prototype, "dateMiseAJour", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Roles_1.Roles, (roles) => roles.userRoles, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)([{ name: "role_id", referencedColumnName: "id" }]),
    __metadata("design:type", Roles_1.Roles)
], UserRoles.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.userRoles, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)([{ name: "user_id", referencedColumnName: "id" }]),
    __metadata("design:type", Users_1.Users)
], UserRoles.prototype, "user", void 0);
UserRoles = __decorate([
    (0, typeorm_1.Index)("user_roles_pkey", ["id"], { unique: true }),
    (0, typeorm_1.Index)("user_roles_user_id_role_id_unique", ["roleId", "userId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("user_roles", { schema: "public" })
], UserRoles);
exports.UserRoles = UserRoles;
//# sourceMappingURL=UserRoles.js.map