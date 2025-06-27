import { Repository } from 'typeorm';
import { ReimbursementRequest } from 'src/entities/entities/ReimbursementRequest';
import { CreateReimbursementDto } from './dto/create-reimbursement.dto';
import { UpdateReimbursementDto } from './dto/update-reimbursement.dto';
import { Depenses } from 'src/entities/entities/Depenses';
import { Users } from 'src/entities/entities/Users';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ReimbursementsService {
    private reimbursementRepo;
    private depenseRepo;
    private userRepo;
    private readonly notificationsService;
    constructor(reimbursementRepo: Repository<ReimbursementRequest>, depenseRepo: Repository<Depenses>, userRepo: Repository<Users>, notificationsService: NotificationsService);
    create(dto: CreateReimbursementDto, userId: string): Promise<ReimbursementRequest>;
    findAll(): Promise<ReimbursementRequest[]>;
    findMine(userId: string): Promise<ReimbursementRequest[]>;
    findOne(id: string): Promise<ReimbursementRequest>;
    update(id: string, dto: UpdateReimbursementDto): Promise<ReimbursementRequest>;
    remove(id: string): Promise<ReimbursementRequest>;
}
