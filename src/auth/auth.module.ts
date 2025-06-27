import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsService } from './services/permissions.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/entities/Users';
import { ResetModule } from './reset/reset.module'; // ✅ Import du module complet

@Module({
  imports: [
    UsersModule,
    RolesModule,
    PassportModule,
    ResetModule, // ✅ Nécessaire pour injecter ResetTokenRepository
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
    PermissionsService,
    PermissionsGuard,
    // ❌ Retire ResetService d'ici, il est déjà fourni par ResetModule
  ],
  exports: [
    AuthService,
    RolesGuard,
    PermissionsService,
    PermissionsGuard,
  ],
})
export class AuthModule {}
