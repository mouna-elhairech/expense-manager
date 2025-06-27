import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../entities/entities/Users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('❌ JWT_SECRET non défini dans le fichier .env');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });

    const masked = jwtSecret.substring(0, 3) + '...' + jwtSecret.slice(-3);
    this.logger.log(`✅ JWT_SECRET utilisé par le backend = ${jwtSecret}`);
    this.logger.log(`🔒 JWT strategy initialized with secret: ${masked}`);
  }

  async validate(payload: any) {
    this.logger.log(`🔐 Payload JWT reçu : ${JSON.stringify(payload)}`);

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      this.logger.error('❌ Utilisateur introuvable en base');
      throw new UnauthorizedException('Token invalide ou utilisateur inexistant');
    }

    return {
      id: user.id, // ✅ Le bon champ attendu par le frontend
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      roles: user.userRoles.map((ur) => ur.role?.nom),
    };
  }
}
