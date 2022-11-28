import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

const TOKENIZED_VOTES_ADDRESS = '0xF6e8FF785bA56C14DeE6056d457e2F78DB868Ece';

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;

  constructor(private configService: ConfigService) {
    this.provider = ethers.getDefaultProvider('goerli');
  }

  getTokenAddress() {
    return { result: TOKENIZED_VOTES_ADDRESS };
  }

  claimTokens(address: string) {
    // TODO: build the contract object
    // TODO : pick the singer using .env keys
    // TODO: connect the contract object to signer
    // TODO: make the transaction to mint tokens
    // TODO: await the transaction, get the receipt, return the hash
    return { result: `transaction hash for tokens minted for ${address}` };
  }
}
