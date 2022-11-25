import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('claim-token')
  claimTokens(@Body() body: any) {
    return this.appService.claimTokens();
  }
}
