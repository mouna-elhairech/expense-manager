// src/auth/services/permissions.service.ts
import { Injectable } from '@nestjs/common';

// Définir les permissions disponibles
export enum Permission {
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',
  // Ajoutez d'autres permissions au besoin
}

@Injectable()
export class PermissionsService {
  // Vérifier si un utilisateur a une permission spécifique
  hasPermission(user: any, permission: Permission): boolean {
    if (!user || !user.roles) {
      return false;
    }

    // Parcourir les rôles de l'utilisateur et vérifier les permissions
    // Adaptation pour utiliser 'nom' au lieu de 'name'
    return user.roles.some(role => {
      // Cas spécial pour le rôle ADMIN
      if (role.nom === 'ADMIN') {
        return true;
      }
      // Vérifier les permissions spécifiques
      return role.permissions && role.permissions.includes(permission);
    });
  }

  // Vérifier si un utilisateur a toutes les permissions spécifiées
  hasAllPermissions(user: any, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(user, permission));
  }

  // Vérifier si un utilisateur a au moins une des permissions spécifiées
  hasAnyPermission(user: any, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(user, permission));
  }
}