import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Depenses } from '../entities/entities/Depenses';
import { GenerateReportDto } from './dto/generate-report.dto';
import { StatutDepense } from '../entities/entities/Depenses';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Depenses)
    private readonly depenseRepo: Repository<Depenses>,
  ) {}

  async generateReport(dto: GenerateReportDto) {
    const { dateDebut, dateFin, statut } = dto;

    const dateStart = new Date(dateDebut);
    const dateEnd = new Date(dateFin);
    dateEnd.setHours(23, 59, 59, 999); // Inclure toute la journée de fin

    return this.depenseRepo.find({
      where: {
        dateDepense: Between(dateStart, dateEnd),
        statut: StatutDepense[statut.toUpperCase() as keyof typeof StatutDepense],
      },
      relations: ['user', 'categorie'], // très important pour le frontend
      order: { dateDepense: 'DESC' },
    });
  }
}
