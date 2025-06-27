"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentairesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const commentaires_controller_1 = require("./commentaires.controller");
const commentaires_service_1 = require("./commentaires.service");
const Commentaires_1 = require("../entities/entities/Commentaires");
const Users_1 = require("../entities/entities/Users");
const Depenses_1 = require("../entities/entities/Depenses");
const users_module_1 = require("../users/users.module");
const notifications_module_1 = require("../notifications/notifications.module");
const expenses_module_1 = require("../expenses/expenses.module");
let CommentairesModule = class CommentairesModule {
};
CommentairesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Commentaires_1.Commentaires,
                Users_1.Users,
                Depenses_1.Depenses,
            ]),
            users_module_1.UsersModule,
            notifications_module_1.NotificationsModule,
            expenses_module_1.ExpensesModule,
        ],
        controllers: [commentaires_controller_1.CommentairesController],
        providers: [commentaires_service_1.CommentairesService],
        exports: [commentaires_service_1.CommentairesService],
    })
], CommentairesModule);
exports.CommentairesModule = CommentairesModule;
//# sourceMappingURL=commentaires.module.js.map