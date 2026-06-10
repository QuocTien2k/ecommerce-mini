import { Controller, Get } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('home')
  async getHomeData() {
    return this.publicService.getHomeData();
  }
}
