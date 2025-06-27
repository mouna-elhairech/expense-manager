import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Users } from '../entities/entities/Users';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.motDePasse);
    if (!isPasswordValid) return null;

    const { motDePasse, ...result } = user;
    return result;
  }

  async login(user: Users) {
    const fullUser = await this.usersService.findByEmailWithRoles(user.email);

    if (!fullUser) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    const roleNames = fullUser.userRoles?.map((ur) => ur.role?.nom).filter(Boolean) || [];

    const payload = {
      sub: fullUser.id,
      email: fullUser.email,
      roles: roleNames,
    };

    console.log('🧪 PAYLOAD JWT =', payload);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: fullUser.id,
        email: fullUser.email,
        nom: fullUser.nom,
        prenom: fullUser.prenom,
        roles: roleNames,
      },
    };
  }

  // ✅ Changer le mot de passe (connecté)
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.motDePasse);
    if (!isMatch) throw new UnauthorizedException('Ancien mot de passe incorrect');

    const hashedNew = await bcrypt.hash(dto.newPassword, 10);
    user.motDePasse = hashedNew;
    await this.usersService.save(user);

    return { message: 'Mot de passe modifié avec succès.' };
  }
}
