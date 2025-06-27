import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * ✅ Générer un rapport (accès pour MANAGER et ADMIN uniquement)
   */
  @Post()
  @Roles('ADMIN', 'MANAGER')
  async generate(@Body() dto: GenerateReportDto) {
    return this.reportsService.generateReport(dto);
  }
}
