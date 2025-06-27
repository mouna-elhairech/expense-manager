import {
  Controller,
  Post,
  Patch,
  UseGuards,
  Request,
  Body,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { ForgotPasswordDto } from './reset/dto/forgot-password.dto';
import { ResetPasswordDto } from './reset/dto/reset-password.dto';
import { ResetService } from './reset/reset.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private rolesService: RolesService,
    private resetService: ResetService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    if (!req.user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(req.user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.resetService.forgotPassword(dto);
    return { message: 'Si cet email existe, un lien a été envoyé.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.resetService.resetPassword(dto);
    return { message: 'Mot de passe mis à jour avec succès.' };
  }

  @Post('create-admin')
  async createAdmin() {
    const email = 'mouna@admin.com';
    const password = 'manani';

    const existing = await this.usersService.findByEmail(email).catch(() => null);
    if (existing) {
      return { message: 'Admin déjà existant', id: existing.id };
    }

    const hashed = await bcrypt.hash(password, 10);
    const role = await this.rolesService.findByName('ADMIN');

    const user = await this.usersService.create({
      email,
      password: hashed,
      firstName: 'Mouna',
      lastName: 'Admin',
      roleIds: [role.id],
    });

    return {
      message: 'Admin créé avec succès',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  @Post('create-test-user')
  async createTestUser() {
    const email = 'test@example.com';

    const existing = await this.usersService.findByEmail(email).catch(() => null);
    if (existing) {
      return { message: 'Utilisateur test déjà existant', id: existing.id };
    }

    const hashed = await bcrypt.hash('password123', 10);

    const user = await this.usersService.create({
      email,
      password: hashed,
      firstName: 'Test',
      lastName: 'User',
    });

    return {
      message: 'Utilisateur test créé avec succès',
      id: user.id,
    };
  }

  // ✅ Nouvelle route : Changement de mot de passe connecté
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }
}
