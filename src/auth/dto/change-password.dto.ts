import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'L’ancien mot de passe est requis.' })
  oldPassword: string;

  @IsString({ message: 'Le nouveau mot de passe est requis.' })
  @MinLength(6, { message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' })
  newPassword: string;
}
