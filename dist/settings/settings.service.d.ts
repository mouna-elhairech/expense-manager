import { Repository } from 'typeorm';
import { Settings } from '../entities/entities/Settings';
export declare class SettingsService {
    private readonly settingsRepo;
    constructor(settingsRepo: Repository<Settings>);
    getSettings(): Promise<Settings>;
    updateSettings(update: Partial<Settings>): Promise<Settings>;
}
