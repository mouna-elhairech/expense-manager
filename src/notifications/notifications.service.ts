import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notifications, NotificationType } from '../entities/entities/notifications';
import { Users } from '../entities/entities/Users';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private readonly notificationRepository: Repository<Notifications>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    contenu: string,
    targetUrl: string | null = null,
  ): Promise<Notifications> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const notification = this.notificationRepository.create({
      user,
      type,
      contenu,
      estLue: false,
      dateCreation: new Date(),
      dateLecture: null,
      targetUrl,
    });

    return this.notificationRepository.save(notification);
  }

  /**
   Obtenir toutes les notifications d’un utilisateur (triées par date décroissante)
   */
  async findByUser(userId: string): Promise<Notifications[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { dateCreation: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notifications> {
    const notif = await this.notificationRepository.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification non trouvée');

    notif.estLue = true;
    notif.dateLecture = new Date();
    return this.notificationRepository.save(notif);
  }
}
