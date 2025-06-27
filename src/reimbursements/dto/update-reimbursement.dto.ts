import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReimbursementStatus } from 'src/entities/entities/ReimbursementRequest';

export class UpdateReimbursementDto {
  @IsEnum(ReimbursementStatus)
  statut: ReimbursementStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  // ✅ Ajout du champ approvedBy pour permettre l'identification du manager
  @IsOptional()
  @IsString()
  approvedBy?: string;
}
