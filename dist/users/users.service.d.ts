import { Repository } from 'typeorm';
import { Users } from '../entities/entities/Users';
import { UserRoles } from '../entities/entities/UserRoles';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
export declare class UsersService {
    private usersRepository;
    private userRolesRepository;
    private rolesService;
    constructor(usersRepository: Repository<Users>, userRolesRepository: Repository<UserRoles>, rolesService: RolesService);
    create(createUserDto: CreateUserDto): Promise<Users>;
    private isBcryptHash;
    assignRolesToUser(userId: string, roleIds: string[] | number[]): Promise<void>;
    findAll(): Promise<Users[]>;
    findOne(id: string): Promise<Users>;
    findById(id: string): Promise<Users>;
    save(user: Users): Promise<Users>;
    findByEmail(email: string): Promise<Users>;
    findByEmailWithRoles(email: string): Promise<Users | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Users>;
    remove(id: string): Promise<void>;
    countUsers(): Promise<number>;
}
