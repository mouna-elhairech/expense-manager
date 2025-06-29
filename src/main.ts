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

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Seed automatique
  try {
    const rolesService = app.get(RolesService);
    await rolesService.ensureBasicRolesExist();
  } catch (error) {
    console.error('❌ Erreur lors de la création des rôles :', error);
  }
  try {
    const categorySeeder = app.get(CategoriesSeeder);
    await categorySeeder.seed();
  } catch (error) {
    console.error('❌ Erreur lors du seed des catégories :', error);
  }

  // Healthcheck
  app.getHttpAdapter().get('/', (_req, res) => res.status(200).send('OK'));

  // PORT issu de l'env (Render définit process.env.PORT)
  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);
  console.log(`🚀 Backend is running on http://localhost:${port}`);
}

bootstrap();
