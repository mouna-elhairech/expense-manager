import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  @Matches(/\d/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
