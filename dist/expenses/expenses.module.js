"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const expenses_service_1 = require("./expenses.service");
const expenses_controller_1 = require("./expenses.controller");
const Depenses_1 = require("../entities/entities/Depenses");
const Commentaires_1 = require("../entities/entities/Commentaires");
const Users_1 = require("../entities/entities/Users");
const category_entity_1 = require("../categories/entities/category.entity");
const OcrProcessing_1 = require("../entities/entities/OcrProcessing");
const NlpCategorization_1 = require("../entities/entities/NlpCategorization");
const categories_module_1 = require("../categories/categories.module");
const notifications_1 = require("../entities/entities/notifications");
const notifications_module_1 = require("../notifications/notifications.module");
let ExpensesModule = class ExpensesModule {
};
ExpensesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Depenses_1.Depenses,
                Commentaires_1.Commentaires,
                Users_1.Users,
                category_entity_1.Category,
                OcrProcessing_1.OcrProcessing,
                NlpCategorization_1.NlpCategorization,
                notifications_1.Notifications,
            ]),
            categories_module_1.CategoriesModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [expenses_controller_1.ExpensesController],
        providers: [expenses_service_1.ExpensesService],
        exports: [expenses_service_1.ExpensesService],
    })
], ExpensesModule);
exports.ExpensesModule = ExpensesModule;
//# sourceMappingURL=expenses.module.js.map