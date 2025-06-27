import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    generate(dto: GenerateReportDto): Promise<import("../entities/entities/Depenses").Depenses[]>;
}
