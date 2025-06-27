import { Repository } from 'typeorm';
import { Depenses } from '../entities/entities/Depenses';
import { GenerateReportDto } from './dto/generate-report.dto';
export declare class ReportsService {
    private readonly depenseRepo;
    constructor(depenseRepo: Repository<Depenses>);
    generateReport(dto: GenerateReportDto): Promise<Depenses[]>;
}
