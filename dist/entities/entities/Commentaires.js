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
exports.Commentaires = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let Commentaires = class Commentaires {
};
__decorate([
    (0, typeorm_1.Column)("uuid", { primary: true, name: "id" }),
    __metadata("design:type", String)
], Commentaires.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "contenu" }),
    __metadata("design:type", String)
], Commentaires.prototype, "contenu", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "entity_type", length: 50 }),
    __metadata("design:type", String)
], Commentaires.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid", { name: "entity_id" }),
    __metadata("design:type", String)
], Commentaires.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "date_creation" }),
    __metadata("design:type", Date)
], Commentaires.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "date_mise_a_jour" }),
    __metadata("design:type", Date)
], Commentaires.prototype, "dateMiseAJour", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.commentaires, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "user_id", referencedColumnName: "id" }]),
    __metadata("design:type", Users_1.Users)
], Commentaires.prototype, "utilisateur", void 0);
Commentaires = __decorate([
    (0, typeorm_1.Index)("commentaires_pkey", ["id"], { unique: true }),
    (0, typeorm_1.Entity)("commentaires", { schema: "public" })
], Commentaires);
exports.Commentaires = Commentaires;
//# sourceMappingURL=Commentaires.js.map