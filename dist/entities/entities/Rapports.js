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
exports.Rapports = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let Rapports = class Rapports {
};
__decorate([
    (0, typeorm_1.Column)("uuid", { primary: true, name: "id" }),
    __metadata("design:type", String)
], Rapports.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "titre", length: 255 }),
    __metadata("design:type", String)
], Rapports.prototype, "titre", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "date_debut" }),
    __metadata("design:type", String)
], Rapports.prototype, "dateDebut", void 0);
__decorate([
    (0, typeorm_1.Column)("date", { name: "date_fin" }),
    __metadata("design:type", String)
], Rapports.prototype, "dateFin", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "format", length: 10 }),
    __metadata("design:type", String)
], Rapports.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "date_generation" }),
    __metadata("design:type", Date)
], Rapports.prototype, "dateGeneration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.rapports, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)([{ name: "user_id", referencedColumnName: "id" }]),
    __metadata("design:type", Users_1.Users)
], Rapports.prototype, "user", void 0);
Rapports = __decorate([
    (0, typeorm_1.Index)("rapports_pkey", ["id"], { unique: true }),
    (0, typeorm_1.Entity)("rapports", { schema: "public" })
], Rapports);
exports.Rapports = Rapports;
//# sourceMappingURL=Rapports.js.map