import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Users } from '../entities/entities/Users';
import { UserRoles } from '../entities/entities/UserRoles';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(UserRoles)
    private userRolesRepository: Repository<UserRoles>,
    private rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const { password, roleIds, ...userData } = createUserDto;
    const userId = randomUUID();
    const newUser = new Users();

    newUser.id = userId;
    newUser.email = userData.email;
    newUser.prenom = userData.firstName;
    newUser.nom = userData.lastName;

    newUser.motDePasse = this.isBcryptHash(password)
      ? password
      : await bcrypt.hash(password, 10);

    const now = new Date();
    newUser.dateCreation = now;
    newUser.dateMiseAJour = now;

    const savedUser = await this.usersRepository.save(newUser);

    if (roleIds && roleIds.length > 0) {
      await this.assignRolesToUser(userId, roleIds);
    }

    return this.findOne(userId);
  }

  private isBcryptHash(value: string): boolean {
    return typeof value === 'string' && /^\$2[abxy]?\$[0-9]{2}\$/.test(value);
  }

  async assignRolesToUser(userId: string, roleIds: string[] | number[]): Promise<void> {
    for (const roleId of roleIds) {
      const userRole = new UserRoles();
      userRole.id = randomUUID();
      userRole.userId = userId;
      userRole.roleId = roleId.toString();
      const now = new Date();
      userRole.dateCreation = now;
      userRole.dateMiseAJour = now;
      await this.userRolesRepository.save(userRole);
    }
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find({
      relations: ['userRoles', 'userRoles.role'],
      order: { dateCreation: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findById(id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
    return user;
  }

  async save(user: Users): Promise<Users> {
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findByEmailWithRoles(email: string): Promise<Users | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
      select: {
        id: true,
        email: true,
        prenom: true,
        nom: true,
        motDePasse: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.findOne(id);
    const { password, roleIds, ...userData } = updateUserDto;

    if (userData.email) user.email = userData.email;
    if (userData.firstName) user.prenom = userData.firstName;
    if (userData.lastName) user.nom = userData.lastName;

    if (password) {
      user.motDePasse = this.isBcryptHash(password)
        ? password
        : await bcrypt.hash(password, 10);
    }

    user.dateMiseAJour = new Date();
    await this.usersRepository.save(user);

    if (roleIds && roleIds.length > 0) {
      await this.userRolesRepository.delete({ userId: id });
      await this.assignRolesToUser(id, roleIds);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRolesRepository.delete({ userId: id });
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async countUsers(): Promise<number> {
    return this.usersRepository.count();
  }
}
