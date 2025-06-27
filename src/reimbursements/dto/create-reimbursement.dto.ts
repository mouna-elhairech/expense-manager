import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateReimbursementDto {
  @IsArray()
  @IsUUID('all', { each: true })
  depenses: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
