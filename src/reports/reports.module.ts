import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Depenses } from '../entities/entities/Depenses';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Depenses])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
