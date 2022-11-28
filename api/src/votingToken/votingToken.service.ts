import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

import * as tokensJson from '../assets/MyToken.json';

const TOKENIZED_VOTES_ADDRESS = '0xF6e8FF785bA56C14DeE6056d457e2F78DB868Ece';
const TOKEN_AMOUNT = ethers.BigNumber.from(100);

@Injectable()
export class VotingTokenService {
  constructor(private configService: ConfigService) {}
  getTokenContractAddress() {
    return { result: TOKENIZED_VOTES_ADDRESS };
  }

  async claimTokens(address: string) {
    const provider: ethers.providers.Provider =
      ethers.providers.getDefaultProvider('goerli');
    // pick the signer using the .env keys
    const wallet: ethers.Wallet = new ethers.Wallet(
      this.configService.get('PRIVATE_KEY'),
    ).connect(provider);

    // build contract object
    const contract = new ethers.Contract(
      TOKENIZED_VOTES_ADDRESS,
      tokensJson.abi,
      wallet,
    );
    // connect the contract object to the signer
    // make the transaction to mint tokens
    const mintTx = await contract.connect(wallet).mint(address, TOKEN_AMOUNT);

    // await the transaction, get the receipt, return the hash
    return {
      result: mintTx.hash,
    };
  }
}
