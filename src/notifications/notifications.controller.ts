import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @Get('me')
  @Roles('EMPLOYEE', 'MANAGER', 'ADMIN')
  async getMyNotifications(@Request() req) {
    const userId = req.user?.id;
    if (!userId) throw new NotFoundException('Utilisateur non trouvé');

    return this.notificationsService.findByUser(userId);
  }

  @Patch(':id/read')
  @Roles('EMPLOYEE', 'MANAGER', 'ADMIN')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
