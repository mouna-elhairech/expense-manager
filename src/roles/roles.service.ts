// src/roles/roles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../entities/entities/Roles';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private roleRepository: Repository<Roles>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Roles> {
    // Adapter la création et fournir un ID explicite
    const role = this.roleRepository.create({
      id: randomUUID(), // Génère un ID UUID
      nom: createRoleDto.name,
      dateCreation: new Date(),
      dateMiseAJour: new Date()
    });
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Roles[]> {
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Roles> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByIds(ids: string[]): Promise<Roles[]> {
    if (!ids || ids.length === 0) return [];
    return this.roleRepository.findByIds(ids);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Roles> {
    const role = await this.findOne(id);
    
    if (updateRoleDto.name) {
      role.nom = updateRoleDto.name;
    }
    
    role.dateMiseAJour = new Date();
    
    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }

  async findByName(name: string): Promise<Roles> {
    // Mettre à jour cette méthode pour rechercher avec le nom en majuscules 
    const upperCaseName = name.toUpperCase();
    const role = await this.roleRepository.findOne({ where: { nom: upperCaseName } });
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }

  async ensureBasicRolesExist(): Promise<void> {
    const defaultRoles = [
      {
        id: randomUUID(),
        nom: 'ADMIN',
        dateCreation: new Date(),
        dateMiseAJour: new Date()
      },
      {
        id: randomUUID(),
        nom: 'MANAGER',
        dateCreation: new Date(),
        dateMiseAJour: new Date()
      },
      {
        id: randomUUID(),
        nom: 'USER',
        dateCreation: new Date(),
        dateMiseAJour: new Date()
      },
    ];

    try {
      const existingRoles = await this.findAll();
      
      for (const defaultRole of defaultRoles) {
        const roleExists = existingRoles.some(
          role => role.nom === defaultRole.nom
        );
        
        if (!roleExists) {
          await this.roleRepository.save(defaultRole);
          console.log(`Created default role: ${defaultRole.nom}`);
        }
      }
    } catch (error) {
      console.error('Error initializing roles:', error);
    }
  }
}