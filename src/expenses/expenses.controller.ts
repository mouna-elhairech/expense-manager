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
  Query,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StatutDepense } from '../entities/entities/Depenses';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // ➕ Créer une dépense
  @Post()
  @Roles('EMPLOYEE')
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user?.id);
  }

  // 📥 Obtenir toutes les dépenses (ADMIN ou MANAGER)
  @Get()
  @Roles('ADMIN', 'MANAGER')
  findAll(@Request() req) {
    return this.expensesService.findAllForUser(req.user);
  }

  // ✅ Obtenir ses propres dépenses avec filtres : /expenses/me?statut=SUBMITTED&free=true
  @Get('me')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  getMyExpenses(
    @Request() req,
    @Query('statut') statut?: StatutDepense,
    @Query('free') freeParam?: string
  ) {
    const free = freeParam === 'true';
    return this.expensesService.findMine(req.user?.id, statut, free);
  }

  // 📊 Statistiques personnelles employé (dashboard)
  @Get('me/stats')
  @Roles('EMPLOYEE')
  getMyStats(@Request() req) {
    return this.expensesService.getStatsForUser(req.user.id);
  }

  // 📊 Statistiques manager (dashboard)
  @Get('manager/stats')
  @Roles('MANAGER')
  getManagerStats() {
    return this.expensesService.getStatsForManager();
  }

  // 🔍 Dépenses d’un utilisateur spécifique
  @Get('user/:id')
  @Roles('ADMIN', 'MANAGER')
  getExpensesByUser(@Param('id') userId: string) {
    return this.expensesService.findByUser(userId);
  }

  // 📊 Statistiques globales
  @Get('stats')
  @Roles('ADMIN')
  getStats() {
    return this.expensesService.getExpenseStats();
  }

  // 📄 Détail d’une dépense
  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  // ✏️ Modifier une dépense
  @Patch(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  // 🔁 Changer le statut
  @Patch(':id/statut')
  @Roles('ADMIN', 'MANAGER')
  updateStatut(
    @Param('id') id: string,
    @Body('statut') statut: StatutDepense,
  ) {
    return this.expensesService.updateStatut(id, statut);
  }

  @Post(':id/comments')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  addComment(
    @Param('id') id: string,
    @Body('contenu') contenu: string,
    @Request() req,
  ) {
    return this.expensesService.addComment(id, contenu, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
