import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRoleDto {
  @IsUUID('4', { message: 'roleId doit être un UUID valide' })
  @IsNotEmpty({ message: 'roleId est requis' })
  roleId: string;
}