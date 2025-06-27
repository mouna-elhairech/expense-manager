import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<import("../entities/entities/Roles").Roles>;
    findAll(): Promise<import("../entities/entities/Roles").Roles[]>;
    findOne(id: string): Promise<import("../entities/entities/Roles").Roles>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<import("../entities/entities/Roles").Roles>;
    remove(id: string): Promise<void>;
}
