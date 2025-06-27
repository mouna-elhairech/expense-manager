import { IsNotEmpty, IsUUID, IsString, IsIn } from 'class-validator';

export class CreateCommentaireDto {
  @IsNotEmpty({ message: 'L\'ID de l\'entité est requis' })
  @IsUUID('4', { message: 'L\'ID de l\'entité doit être un UUID valide' })
  entityId: string;

  @IsNotEmpty({ message: 'Le contenu du commentaire est requis' })
  @IsString({ message: 'Le contenu doit être une chaîne de caractères' })
  contenu: string;

  @IsNotEmpty({ message: 'Le type d\'entité est requis' })
  @IsString()
  @IsIn(['EXPENSE', 'REIMBURSEMENT_REQUEST'], {
    message: 'Le type d\'entité doit être EXPENSE ou REIMBURSEMENT_REQUEST',
  })
  entityType: 'EXPENSE' | 'REIMBURSEMENT_REQUEST';
}
