// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/entities/Users';
import { UserRoles } from '../entities/entities/UserRoles'; // ✅ ici
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module'; // si RolesService est utilisé

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserRoles]), // ✅ ajoute UserRoles ici
    RolesModule, // si UsersService utilise RolesService
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
