import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json';

const TOKENIZED_VOTES_ADDRESS = '0xF6e8FF785bA56C14DeE6056d457e2F78DB868Ece';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  provider: ethers.providers.Provider;
  wallet: ethers.Wallet | undefined;
  tokenContract: ethers.Contract | undefined;
  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;

  constructor() {
    this.provider = ethers.providers.getDefaultProvider('goerli');
  }

  createWallet() {
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
    this.tokenContract = new ethers.Contract(
      TOKENIZED_VOTES_ADDRESS,
      tokenJson.abi,
      this.wallet
    );
    this.wallet.getBalance().then((balanceBN: ethers.BigNumberish) => {
      this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
    });
    this.tokenContract['balanceOf'](this.wallet.address).then(
      (balanceBN: ethers.BigNumberish) => {
        this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
      }
    );
    this.tokenContract['getVotes'](this.wallet.address).then(
      (votesBN: ethers.BigNumberish) => {
        this.votePower = parseFloat(ethers.utils.formatEther(votesBN));
      }
    );
  }
}
