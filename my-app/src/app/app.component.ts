import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  provider: ethers.providers.Provider;
  wallet: ethers.Wallet | undefined;
  tokenAddress: string | undefined;
  tokenContract: ethers.Contract | undefined;
  etherBalance: number | undefined;
  tokenBalance: number | undefined;
  votePower: number | undefined;

  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli');
  }

  createWallet() {
    this.http
      .get<any>('http://localhost:3000/token/token-address')
      .subscribe((ans) => {
        this.tokenAddress = ans.result;
        if (this.tokenAddress) {
          this.wallet = ethers.Wallet.createRandom().connect(this.provider);
          this.tokenContract = new ethers.Contract(
            this.tokenAddress,
            tokenJson.abi,
            this.wallet
          );
          this.wallet.getBalance().then((balanceBN: ethers.BigNumberish) => {
            this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
          });
          this.tokenContract['balanceOf'](this.wallet.address).then(
            (balanceBN: ethers.BigNumberish) => {
              this.tokenBalance = parseFloat(
                ethers.utils.formatEther(balanceBN)
              );
            }
          );
          this.tokenContract['getVotes'](this.wallet.address).then(
            (votesBN: ethers.BigNumberish) => {
              this.votePower = parseFloat(ethers.utils.formatEther(votesBN));
            }
          );
        }
      });
  }

  claimToken() {
    this.http
      .post<any>('http://localhost:3000/claim-token', {
        address: this.wallet?.address,
      })
      .subscribe((ans) => {
        const txHash = ans.result;
        this.provider.getTransaction(txHash).then((tx) => {
          tx.wait().then((receipt) => {
            //TODO
            //Reload info by calling the update info funct
          });
        });
      });
  }

  connectBallot(address: string) {
    this.getBallotInfo();
  }
  delegate() {}
  castVote() {}
  getBallotInfo() {}
}
