import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { Depenses } from '../entities/entities/Depenses';
import { Commentaires } from '../entities/entities/Commentaires';
import { Users } from '../entities/entities/Users';
import { UsersModule } from '../users/users.module';
import { Category } from 'src/categories/entities/category.entity';
import { OcrProcessing } from '../entities/entities/OcrProcessing';
import { NlpCategorization } from '../entities/entities/NlpCategorization';
import { CategoriesModule } from '../categories/categories.module';
import { Notifications } from '../entities/entities/notifications';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Depenses,
      Commentaires,
      Users,
      Category,
      OcrProcessing,
      NlpCategorization,
      Notifications,
    ]),
    CategoriesModule,
    NotificationsModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
