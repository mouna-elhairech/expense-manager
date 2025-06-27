import { Injectable, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoriesSeeder {
  constructor(private readonly categoriesService: CategoriesService) {}

  private readonly logger = new Logger(CategoriesSeeder.name);

  private readonly defaultCategories = [
    { nom: 'Transport', icone: '🚗' },
    { nom: 'Hébergement', icone: '🏨' },
    { nom: 'Repas', icone: '🍽️' },
    { nom: 'Fournitures', icone: '🖊️' },
    { nom: 'Communication', icone: '📡' },
    { nom: 'Autre', icone: '❓' },
  ];

  async seed() {
    for (const cat of this.defaultCategories) {
      const existing = await this.categoriesService.findByNom(cat.nom);
      if (!existing) {
        await this.categoriesService.create({
          nom: cat.nom,
          icone: cat.icone,
        });
        this.logger.log(`✅ Catégorie ajoutée : ${cat.nom}`);
      } else {
        this.logger.log(`ℹ️ Catégorie déjà existante : ${cat.nom}`);
      }
    }
  }
}
