import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetService } from './reset.service';
import { ResetController } from './reset.controller';
import { Users } from 'src/entities/entities/Users';
import { ResetToken } from 'src/entities/entities/ResetToken';
import { EmailService } from 'src/common/services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, ResetToken]),
  ],
  controllers: [ResetController],
  providers: [ResetService, EmailService],
  exports: [ResetService],
})
export class ResetModule {} // ✅ ICI tu déclares bien ton module
