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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const Commentaires_1 = require("./Commentaires");
const Depenses_1 = require("./Depenses");
const notifications_1 = require("./notifications");
const Rapports_1 = require("./Rapports");
const UserRoles_1 = require("./UserRoles");
const Roles_1 = require("./Roles");
let Users = class Users {
};
__decorate([
    (0, typeorm_1.Column)('uuid', { primary: true, name: 'id' }),
    __metadata("design:type", String)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { name: 'email', unique: true, length: 255 }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { name: 'mot_de_passe', length: 255 }),
    __metadata("design:type", String)
], Users.prototype, "motDePasse", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { name: 'prenom', length: 100 }),
    __metadata("design:type", String)
], Users.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', { name: 'nom', length: 100 }),
    __metadata("design:type", String)
], Users.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', {
        name: 'telephone',
        nullable: true,
        length: 20,
    }),
    __metadata("design:type", Object)
], Users.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)('character varying', {
        name: 'photo_profil',
        nullable: true,
        length: 255,
    }),
    __metadata("design:type", Object)
], Users.prototype, "photoProfil", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'date_creation' }),
    __metadata("design:type", Date)
], Users.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'date_mise_a_jour' }),
    __metadata("design:type", Date)
], Users.prototype, "dateMiseAJour", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Commentaires_1.Commentaires, (commentaires) => commentaires.utilisateur),
    __metadata("design:type", Array)
], Users.prototype, "commentaires", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Depenses_1.Depenses, (depenses) => depenses.user),
    __metadata("design:type", Array)
], Users.prototype, "depenses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notifications_1.Notifications, (notifications) => notifications.user),
    __metadata("design:type", Array)
], Users.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Rapports_1.Rapports, (rapports) => rapports.user),
    __metadata("design:type", Array)
], Users.prototype, "rapports", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserRoles_1.UserRoles, (userRoles) => userRoles.user),
    __metadata("design:type", Array)
], Users.prototype, "userRoles", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Roles_1.Roles, (role) => role.users, { eager: false }),
    (0, typeorm_1.JoinTable)({
        name: 'user_roles',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Users.prototype, "roles", void 0);
Users = __decorate([
    (0, typeorm_1.Index)('users_email_unique', ['email'], { unique: true }),
    (0, typeorm_1.Index)('users_pkey', ['id'], { unique: true }),
    (0, typeorm_1.Entity)('users', { schema: 'public' })
], Users);
exports.Users = Users;
//# sourceMappingURL=Users.js.map