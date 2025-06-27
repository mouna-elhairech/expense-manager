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
exports.Roles = void 0;
const typeorm_1 = require("typeorm");
const UserRoles_1 = require("./UserRoles");
const Users_1 = require("./Users");
let Roles = class Roles {
};
__decorate([
    (0, typeorm_1.Column)('uuid', { primary: true, name: 'id' }),
    __metadata("design:type", String)
], Roles.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { name: 'nom', length: 50 }),
    __metadata("design:type", String)
], Roles.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'date_creation' }),
    __metadata("design:type", Date)
], Roles.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'date_mise_a_jour' }),
    __metadata("design:type", Date)
], Roles.prototype, "dateMiseAJour", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserRoles_1.UserRoles, (userRoles) => userRoles.role),
    __metadata("design:type", Array)
], Roles.prototype, "userRoles", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Users_1.Users, (user) => user.roles),
    __metadata("design:type", Array)
], Roles.prototype, "users", void 0);
Roles = __decorate([
    (0, typeorm_1.Index)('roles_pkey', ['id'], { unique: true }),
    (0, typeorm_1.Entity)('roles', { schema: 'public' })
], Roles);
exports.Roles = Roles;
//# sourceMappingURL=Roles.js.map