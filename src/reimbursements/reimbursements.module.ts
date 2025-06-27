import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReimbursementsService } from './reimbursements.service';
import { ReimbursementsController } from './reimbursements.controller';
import { ReimbursementRequest } from 'src/entities/entities/ReimbursementRequest';
import { Depenses } from 'src/entities/entities/Depenses';
import { Users } from 'src/entities/entities/Users';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReimbursementRequest, Depenses, Users]),
    UsersModule,
    NotificationsModule,
  ],
  controllers: [ReimbursementsController],
  providers: [ReimbursementsService],
})
export class ReimbursementsModule {}
