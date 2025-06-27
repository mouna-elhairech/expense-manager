import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<import("../entities/entities/Settings").Settings>;
    updateSettings(body: any): Promise<import("../entities/entities/Settings").Settings>;
}
