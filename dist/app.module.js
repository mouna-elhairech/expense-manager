"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const expenses_module_1 = require("./expenses/expenses.module");
const reports_module_1 = require("./reports/reports.module");
const settings_module_1 = require("./settings/settings.module");
const categories_module_1 = require("./categories/categories.module");
const notifications_module_1 = require("./notifications/notifications.module");
const commentaires_module_1 = require("./commentaires/commentaires.module");
const reimbursements_module_1 = require("./reimbursements/reimbursements.module");
const Users_1 = require("./entities/entities/Users");
const Roles_1 = require("./entities/entities/Roles");
const UserRoles_1 = require("./entities/entities/UserRoles");
const Depenses_1 = require("./entities/entities/Depenses");
const Recus_1 = require("./entities/entities/Recus");
const OcrProcessing_1 = require("./entities/entities/OcrProcessing");
const category_entity_1 = require("./categories/entities/category.entity");
const NlpCategorization_1 = require("./entities/entities/NlpCategorization");
const ReimbursementRequest_1 = require("./entities/entities/ReimbursementRequest");
const Commentaires_1 = require("./entities/entities/Commentaires");
const notifications_1 = require("./entities/entities/notifications");
const Rapports_1 = require("./entities/entities/Rapports");
const ResetToken_1 = require("./entities/entities/ResetToken");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    transport: {
                        service: 'gmail',
                        auth: {
                            user: config.get('GMAIL_USER'),
                            pass: config.get('GMAIL_PASS'),
                        },
                    },
                    defaults: {
                        from: `"Expense Manager" <${config.get('GMAIL_USER')}>`,
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, 'templates'),
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: { strict: true },
                    },
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    url: process.env.DATABASE_URL,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                    entities: [
                        Users_1.Users,
                        Roles_1.Roles,
                        UserRoles_1.UserRoles,
                        Depenses_1.Depenses,
                        Recus_1.Recus,
                        OcrProcessing_1.OcrProcessing,
                        category_entity_1.Category,
                        NlpCategorization_1.NlpCategorization,
                        ReimbursementRequest_1.ReimbursementRequest,
                        Commentaires_1.Commentaires,
                        notifications_1.Notifications,
                        Rapports_1.Rapports,
                        ResetToken_1.ResetToken,
                    ],
                    synchronize: false,
                    logging: ['query', 'error'],
                    logger: 'advanced-console',
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            expenses_module_1.ExpensesModule,
            reports_module_1.ReportsModule,
            settings_module_1.SettingsModule,
            categories_module_1.CategoriesModule,
            notifications_module_1.NotificationsModule,
            commentaires_module_1.CommentairesModule,
            reimbursements_module_1.ReimbursementsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map