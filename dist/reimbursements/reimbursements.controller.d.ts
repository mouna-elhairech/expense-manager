import { ReimbursementsService } from './reimbursements.service';
import { CreateReimbursementDto } from './dto/create-reimbursement.dto';
import { UpdateReimbursementDto } from './dto/update-reimbursement.dto';
export declare class ReimbursementsController {
    private readonly reimbursementsService;
    constructor(reimbursementsService: ReimbursementsService);
    create(req: any, dto: CreateReimbursementDto): Promise<import("../entities/entities/ReimbursementRequest").ReimbursementRequest>;
    findAll(): Promise<import("../entities/entities/ReimbursementRequest").ReimbursementRequest[]>;
    findMine(req: any): Promise<import("../entities/entities/ReimbursementRequest").ReimbursementRequest[]>;
    findOne(id: string): Promise<import("../entities/entities/ReimbursementRequest").ReimbursementRequest>;
    update(id: string, dto: UpdateReimbursementDto): Promise<import("../entities/entities/ReimbursementRequest").ReimbursementRequest>;
    remove(id: string): Promise<import("../entities/entities/ReimbursementRequest").ReimbursementRequest>;
}
