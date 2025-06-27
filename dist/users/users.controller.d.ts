import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("../entities/entities/Users").Users>;
    getUserCount(): Promise<number>;
    findOne(id: string): Promise<import("../entities/entities/Users").Users>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../entities/entities/Users").Users>;
    findAll(): Promise<import("../entities/entities/Users").Users[]>;
    remove(id: string): Promise<void>;
}
