import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Roles('ADMIN')
  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Roles('ADMIN')
  @Patch()
  updateSettings(@Body() body: any) {
    return this.settingsService.updateSettings(body);
  }
}
