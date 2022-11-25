import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

export class createPaymentOrderDto {
  secret: string;
  value: number;
}

export class claimPaymentOrderDto {
  secret: string;
  address: string;
  id: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('last-block')
  getLastBlock() {
    return this.appService.getBlock('latest');
  }

  @Get('block-by-hash/:hash')
  getBlockByHash(@Param('hash') hash: string) {
    return this.appService.getBlock(hash);
  }

  @Get('total-supply/:address')
  getTotalSupply(@Param('address') address: string) {
    return this.appService.getTotalSupply(address);
  }

  @Get('allowance')
  getAllowance(
    @Query('address') address: string,
    @Query('owner') owner: string,
    @Query('spender') spender: string,
  ) {
    return this.appService.getAllowance(address, owner, spender);
  }

  @Get('payment-order/:id')
  getPaymentOrder(@Param('id') id: number) {
    return this.appService.getPaymentOrder(id);
  }

  @Post('create-payment-order')
  createPaymentOrder(@Body() body: createPaymentOrderDto) {
    return this.appService.createPaymentOrder(body.secret, body.value);
  }

  @Post('claim-payment-order')
  claimPaymentOrder(@Body() body: claimPaymentOrderDto) {
    return this.appService.claimPaymentOrder(
      body.id,
      body.secret,
      body.address,
    );
  }
}
