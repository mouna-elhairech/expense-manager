import { Repository } from 'typeorm';
import { Roles } from '../entities/entities/Roles';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesService {
    private roleRepository;
    constructor(roleRepository: Repository<Roles>);
    create(createRoleDto: CreateRoleDto): Promise<Roles>;
    findAll(): Promise<Roles[]>;
    findOne(id: string): Promise<Roles>;
    findByIds(ids: string[]): Promise<Roles[]>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<Roles>;
    remove(id: string): Promise<void>;
    findByName(name: string): Promise<Roles>;
    ensureBasicRolesExist(): Promise<void>;
}
