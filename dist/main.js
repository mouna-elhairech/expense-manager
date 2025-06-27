"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const roles_service_1 = require("./roles/roles.service");
const categories_seeder_1 = require("./categories/categories.seeder");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        console.error('🔥 ERREUR BACKEND :', exception);
        throw exception;
    }
};
AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3001',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    try {
        const rolesService = app.get(roles_service_1.RolesService);
        await rolesService.ensureBasicRolesExist();
    }
    catch (error) {
        console.error('❌ Erreur lors de la création des rôles :', error);
    }
    try {
        const categorySeeder = app.get(categories_seeder_1.CategoriesSeeder);
        await categorySeeder.seed();
    }
    catch (error) {
        console.error('❌ Erreur lors du seed des catégories :', error);
    }
    await app.listen(3000);
    console.log(`🚀 Backend is running on http://localhost:3000`);
}
bootstrap();
//# sourceMappingURL=main.js.map