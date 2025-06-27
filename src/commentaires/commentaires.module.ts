import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentairesController } from './commentaires.controller';
import { CommentairesService } from './commentaires.service';
import { Commentaires } from '../entities/entities/Commentaires';
import { Users } from '../entities/entities/Users';
import { Depenses } from '../entities/entities/Depenses';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ExpensesModule } from '../expenses/expenses.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commentaires,
      Users,
      Depenses,
    ]),
    UsersModule,
    NotificationsModule,
    ExpensesModule, 
  ],
  controllers: [CommentairesController],
  providers: [CommentairesService],
  exports: [CommentairesService],
})
export class CommentairesModule {}
