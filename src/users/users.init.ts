/*/ src/users/users.init.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
/
@Injectable()
export class UsersInitService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Vérifier si un utilisateur admin existe déjà
    try {
      await this.usersService.findByEmail('admin@example.com');
      console.log('Admin user already exists');
    } catch (error) {
      // Créer un utilisateur admin si aucun n'existe
      try {
        const adminRole = await this.rolesService.findByName('admin');
        
        await this.usersService.create({
          email: 'admin@example.com',
          password: this.configService.get<string>('ADMIN_INITIAL_PASSWORD') || 'Admin123!',
          firstName: 'Admin',
          lastName: 'User',
          roleIds: [adminRole.id],
        });
        
        console.log('Admin user created successfully');
      } catch (createError) {
        console.error('Error creating admin user:', createError);
      }
    }
  }
}
**/
