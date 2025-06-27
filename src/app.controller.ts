import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { status: string; message: string; data?: string } {
    return {
      status: 'OK',
      message: 'Backend is running',
      data: this.appService.getHello()
    };
  }
}