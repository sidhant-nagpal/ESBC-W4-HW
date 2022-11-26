import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

export class claimTokenDto {
  address: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token-address')
  getTokenAddress() {
    return this.appService.getTokenAddress();
  }

  @Post('claim-token')
  claimTokens(@Body() body: claimTokenDto) {
    return this.appService.claimTokens(body.address);
  }
}
