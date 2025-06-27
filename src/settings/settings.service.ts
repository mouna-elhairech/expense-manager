import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from '../entities/entities/Settings';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepo: Repository<Settings>,
  ) {}

  async getSettings(): Promise<Settings> {
    let settings = await this.settingsRepo.findOne({ where: {} });
    if (!settings) {
      settings = this.settingsRepo.create();
      await this.settingsRepo.save(settings);
    }
    return settings;
  }

  async updateSettings(update: Partial<Settings>): Promise<Settings> {
    const settings = await this.getSettings();
    Object.assign(settings, update);
    return this.settingsRepo.save(settings);
  }
}
