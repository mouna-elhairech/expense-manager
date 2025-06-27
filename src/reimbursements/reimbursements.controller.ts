import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReimbursementsService } from './reimbursements.service';
import { CreateReimbursementDto } from './dto/create-reimbursement.dto';
import { UpdateReimbursementDto } from './dto/update-reimbursement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('reimbursements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReimbursementsController {
  constructor(
    private readonly reimbursementsService: ReimbursementsService,
  ) {}

  /**
   *  Créer une nouvelle demande de remboursement (EMPLOYEE)
   */
  @Post()
  @Roles('EMPLOYEE')
  create(@Request() req, @Body() dto: CreateReimbursementDto) {
    const userId = req.user?.id;
    return this.reimbursementsService.create(dto, userId);
  }

  /**
   *  Récupérer toutes les demandes (MANAGER uniquement)
   */
  @Get()
  @Roles('MANAGER')
  findAll() {
    return this.reimbursementsService.findAll();
  }

  /**
   *  Récupérer les demandes de l’utilisateur connecté (EMPLOYEE)
   */
  @Get('me')
  @Roles('EMPLOYEE')
  findMine(@Request() req) {
    const userId = req.user?.id;
    return this.reimbursementsService.findMine(userId);
  }

  /**
   *  Obtenir les détails d'une demande (EMPLOYEE ou MANAGER)
   */
  @Get(':id')
  @Roles('EMPLOYEE', 'MANAGER')
  findOne(@Param('id') id: string) {
    return this.reimbursementsService.findOne(id);
  }

  /**
   *  Mise à jour du statut d’une demande (MANAGER)
   */
  @Patch(':id')
  @Roles('MANAGER')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReimbursementDto,
  ) {
    return this.reimbursementsService.update(id, dto);
  }

  /**
   *  Supprimer une demande de remboursement (MANAGER)
   */
  @Delete(':id')
  @Roles('MANAGER')
  remove(@Param('id') id: string) {
    return this.reimbursementsService.remove(id);
  }
}
