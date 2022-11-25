import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;

  constructor(private configService: ConfigService) {
    this.provider = ethers.getDefaultProvider('goerli');
  }

  claimTokens() {}
}
