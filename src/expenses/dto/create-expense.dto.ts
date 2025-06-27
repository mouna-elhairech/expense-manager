import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { StatutDepense } from '../../entities/entities/Depenses';

export class CreateExpenseDto {
  @IsNumber({}, { message: 'Le montant doit être un nombre.' })
  montant: number;

  @IsString({ message: 'La devise est requise (ex: EUR, USD).' })
  devise: string;

  @IsDateString({}, { message: 'La date de dépense doit être au format ISO.' })
  dateDepense: string;

  @IsString({ message: 'La description est obligatoire.' })
  description: string;

  @IsOptional()
  @IsEnum(StatutDepense, {
    message:
      'Le statut doit être l’un des suivants : SUBMITTED, APPROVED, REJECTED, REIMBURSED',
  })
  statut?: StatutDepense;

  @IsOptional()
  @IsUUID('4', { message: 'L’ID de catégorie doit être un UUID valide.' })
  categorieId?: string;
}
