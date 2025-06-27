import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ReimbursementRequest,
  ReimbursementStatus,
} from 'src/entities/entities/ReimbursementRequest';
import { CreateReimbursementDto } from './dto/create-reimbursement.dto';
import { UpdateReimbursementDto } from './dto/update-reimbursement.dto';
import { Depenses, StatutDepense } from 'src/entities/entities/Depenses';
import { Users } from 'src/entities/entities/Users';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from 'src/entities/entities/notifications';

@Injectable()
export class ReimbursementsService {
  constructor(
    @InjectRepository(ReimbursementRequest)
    private reimbursementRepo: Repository<ReimbursementRequest>,

    @InjectRepository(Depenses)
    private depenseRepo: Repository<Depenses>,

    @InjectRepository(Users)
    private userRepo: Repository<Users>,

    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateReimbursementDto, userId: string) {
    const { depenses: depenseIds, notes } = dto;

    if (!depenseIds || depenseIds.length === 0) {
      throw new NotFoundException('Aucune dépense sélectionnée.');
    }

    const selectedDepenses = await this.depenseRepo
      .createQueryBuilder('depense')
      .leftJoinAndSelect('depense.user', 'user')
      .where('depense.id IN (:...ids)', { ids: depenseIds })
      .andWhere('user.id = :userId', { userId })
      .andWhere('depense.statut = :statut', { statut: StatutDepense.SUBMITTED })
      .andWhere('depense.reimbursementRequest IS NULL')
      .getMany();

    if (selectedDepenses.length === 0) {
      throw new NotFoundException('Aucune dépense valide trouvée.');
    }

    const total = selectedDepenses.reduce((sum, d) => sum + Number(d.montant), 0);

    const newRequest = this.reimbursementRepo.create({
      montantTotal: total,
      notes,
      statut: ReimbursementStatus.PENDING,
      dateCreation: new Date(),
      depenses: selectedDepenses,
    });

    const savedRequest = await this.reimbursementRepo.save(newRequest);

    for (const dep of selectedDepenses) {
      dep.reimbursementRequest = savedRequest;
      await this.depenseRepo.save(dep);
    }

    const employe = await this.userRepo.findOne({ where: { id: userId } });
    const fullName = `${employe?.prenom || ''} ${employe?.nom || ''}`.trim();

    const managers = await this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .where('role.nom = :roleName', { roleName: 'MANAGER' })
      .getMany();

    for (const manager of managers) {
      await this.notificationsService.create(
        manager.id,
        NotificationType.REIMBURSEMENT,
        ` Nouvelle demande de remboursement soumise par ${fullName}`,
        `/reimbursements/${savedRequest.id}`,
      );
    }

    return savedRequest;
  }

  async findAll() {
    return this.reimbursementRepo.find({
      relations: ['depenses', 'depenses.user'],
      order: { dateCreation: 'DESC' },
    });
  }

  async findMine(userId: string) {
    return this.reimbursementRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.depenses', 'd')
      .where('d.user.id = :userId', { userId })
      .orderBy('r.dateCreation', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    const found = await this.reimbursementRepo.findOne({
      where: { id },
      relations: ['depenses'],
    });

    if (!found) throw new NotFoundException('Demande non trouvée');
    return found;
  }

  async update(id: string, dto: UpdateReimbursementDto) {
    const request = await this.reimbursementRepo.findOne({
      where: { id },
      relations: ['depenses', 'depenses.user'],
    });

    if (!request) throw new NotFoundException('Demande non trouvée');

    Object.assign(request, dto);
    const updated = await this.reimbursementRepo.save(request);

    if (
      dto.statut === ReimbursementStatus.APPROVED ||
      dto.statut === ReimbursementStatus.REJECTED
    ) {
      const employee = request.depenses[0]?.user;

      if (!dto.approvedBy) {
        throw new NotFoundException('approvedBy manquant');
      }

      const manager = await this.userRepo.findOne({
        where: { id: dto.approvedBy },
      });

      if (!manager) {
        throw new NotFoundException(`Manager avec l'ID ${dto.approvedBy} introuvable`);
      }

      const fullManager = `${manager.prenom || ''} ${manager.nom || ''}`.trim();

      const notificationType =
        dto.statut === ReimbursementStatus.APPROVED
          ? NotificationType.APPROVAL
          : NotificationType.REJECTION;

      const message =
        dto.statut === ReimbursementStatus.APPROVED
          ? ` Votre demande a été approuvée par ${fullManager}`
          : ` Votre demande a été rejetée par ${fullManager}`;

      if (employee?.id) {
        await this.notificationsService.create(
          employee.id,
          notificationType,
          message,
          `/reimbursements/${updated.id}`,
        );
      }

      for (const dep of request.depenses) {
        dep.statut =
          dto.statut === ReimbursementStatus.APPROVED
            ? StatutDepense.APPROVED
            : StatutDepense.REJECTED;
        await this.depenseRepo.save(dep);
      }
    }

    return updated;
  }

  async remove(id: string) {
    const request = await this.reimbursementRepo.findOneBy({ id });
    if (!request) throw new NotFoundException('Demande non trouvée');
    return this.reimbursementRepo.remove(request);
  }
}
