// src/roles/roles.init.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RolesService } from './roles.service';

@Injectable()
export class RolesInitService implements OnModuleInit {
  constructor(private rolesService: RolesService) {}

  async onModuleInit() {
    // Appel de la méthode pour créer les rôles par défaut
    try {
      await this.rolesService.ensureBasicRolesExist();
      console.log('Default roles initialized successfully');
    } catch (error) {
      console.error('Error initializing default roles:', error);
    }
  }
}