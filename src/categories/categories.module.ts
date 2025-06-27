import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesSeeder } from './categories.seeder'; 

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesSeeder, 
  ],
  exports: [
    CategoriesService,
    CategoriesSeeder, //  Exporté pour être récupéré dans main.ts
  ],
})
export class CategoriesModule {}
