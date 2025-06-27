import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { RolesService } from './roles/roles.service';
import { CategoriesSeeder } from './categories/categories.seeder';

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('🔥 ERREUR BACKEND :', exception);
    throw exception;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS autorisé pour le frontend
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Validation DTOs globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ Gestion d'erreurs globales
  app.useGlobalFilters(new AllExceptionsFilter());

  // ✅ Création automatique des rôles
  try {
    const rolesService = app.get(RolesService);
    await rolesService.ensureBasicRolesExist();
  } catch (error) {
    console.error('❌ Erreur lors de la création des rôles :', error);
  }

  // ✅ Création automatique des catégories si absentes
  try {
    const categorySeeder = app.get(CategoriesSeeder);
    await categorySeeder.seed();
  } catch (error) {
    console.error('❌ Erreur lors du seed des catégories :', error);
  }

  await app.listen(3000);
  console.log(`🚀 Backend is running on http://localhost:3000`);
}

bootstrap();
