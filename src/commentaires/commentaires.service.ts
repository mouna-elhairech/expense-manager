import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commentaires } from '../entities/entities/Commentaires';
import { Depenses } from '../entities/entities/Depenses';
import { Users } from '../entities/entities/Users';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../entities/entities/notifications';
import { randomUUID } from 'crypto';

@Injectable()
export class CommentairesService {
  constructor(
    @InjectRepository(Commentaires)
    private readonly commentRepository: Repository<Commentaires>,

    @InjectRepository(Depenses)
    private readonly depenseRepository: Repository<Depenses>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateCommentaireDto, userId: string) {
    const { contenu, entityId, entityType = 'EXPENSE' } = dto;
  
    if (!contenu || contenu.trim() === '') {
      throw new BadRequestException('Le contenu du commentaire est requis.');
    }
  
    const utilisateur = await this.usersRepository.findOne({
      where: { id: userId },
    });
  
    if (!utilisateur) {
      throw new BadRequestException('Utilisateur introuvable.');
    }
  
    const commentaire = this.commentRepository.create({
      id: randomUUID(),
      contenu,
      entityId,
      entityType,
      utilisateur,
      dateCreation: new Date(),
      dateMiseAJour: new Date(),
    });
  
    const saved = await this.commentRepository.save(commentaire);
  
    if (entityType === 'EXPENSE') {
      const depense = await this.depenseRepository.findOne({
        where: { id: entityId },
        relations: ['user'],
      });
  
      if (depense && depense.user?.id !== userId) {
        const fullName = `${utilisateur.prenom ?? ''} ${utilisateur.nom ?? ''}`.trim();
  
        await this.notificationsService.create(
          depense.user.id,
          NotificationType.COMMENT,
          `💬 ${fullName} a commenté votre dépense`,
          `/expenses/${entityId}#comment-${saved.id}`, 
        );
      }
    }
  
    return saved;
  }
  

  async findByEntityId(entityId: string) {
    return this.commentRepository.find({
      where: { entityId },
      relations: ['utilisateur'],
      order: { dateCreation: 'ASC' },
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.commentRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }
  async findById(id: string) {
    return this.commentRepository.findOne({
      where: { id },
      relations: ['utilisateur'],
    });
  }
  
}
