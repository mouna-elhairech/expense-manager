import { IsDateString, IsEnum } from 'class-validator';

export enum StatutDepense {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REIMBURSED = 'REIMBURSED',
}

export class GenerateReportDto {
  @IsDateString()
  dateDebut: string;

  @IsDateString()
  dateFin: string;

  @IsEnum(StatutDepense, {
    message: 'Le statut doit être SUBMITTED, APPROVED, REJECTED ou REIMBURSED',
  })
  statut: StatutDepense;
}
