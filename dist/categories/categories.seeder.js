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
var CategoriesSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesSeeder = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
let CategoriesSeeder = CategoriesSeeder_1 = class CategoriesSeeder {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
        this.logger = new common_1.Logger(CategoriesSeeder_1.name);
        this.defaultCategories = [
            { nom: 'Transport', icone: '🚗' },
            { nom: 'Hébergement', icone: '🏨' },
            { nom: 'Repas', icone: '🍽️' },
            { nom: 'Fournitures', icone: '🖊️' },
            { nom: 'Communication', icone: '📡' },
            { nom: 'Autre', icone: '❓' },
        ];
    }
    async seed() {
        for (const cat of this.defaultCategories) {
            const existing = await this.categoriesService.findByNom(cat.nom);
            if (!existing) {
                await this.categoriesService.create({
                    nom: cat.nom,
                    icone: cat.icone,
                });
                this.logger.log(`✅ Catégorie ajoutée : ${cat.nom}`);
            }
            else {
                this.logger.log(`ℹ️ Catégorie déjà existante : ${cat.nom}`);
            }
        }
    }
};
CategoriesSeeder = CategoriesSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesSeeder);
exports.CategoriesSeeder = CategoriesSeeder;
//# sourceMappingURL=categories.seeder.js.map