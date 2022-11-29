import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json';
import ballotJson from '../assets/Ballot.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  provider: ethers.providers.Provider;
  wallet: ethers.Wallet | undefined;
  importInit: boolean | undefined;

  ballotAddress: string | undefined;
  ballotContract: ethers.Contract | undefined;

  tokenAddress: string | undefined;
  tokenContract: ethers.Contract | undefined;
  etherBalance: number | undefined;
  tokenBalance: number | undefined;

  delegateAddress: string | undefined;
  proposalNames: string[];

  voteTx: string | undefined;
  voteIndex: string | undefined;
  votePower: number | undefined;
  votePowerUsed: number | undefined;
  voted: boolean | undefined;
  delegated: boolean | undefined;
  claimWait: boolean | undefined;
  claimed: boolean | undefined;
  claimTx: string | undefined;
  title: any;

  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli');
    this.proposalNames = [];
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

  importing() {
    this.importInit = true;
  }

  importWallet(privateKey: string) {
    this.http
      .get<any>('http://localhost:3000/token/token-address')
      .subscribe((ans) => {
        this.tokenAddress = ans.result;
        if (this.tokenAddress) {
          this.wallet = new ethers.Wallet(privateKey).connect(this.provider);
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

  claimTokens() {
    this.claimWait = true;
    this.http
      .post<any>('http://localhost:3000/token/claim-tokens-order', {
        address: this.wallet?.address,
      })
      .subscribe((ans) => {
        this.claimed = true;
        const txHash = ans.result;
        this.provider.getTransaction(txHash).then((tx) => {
          tx.wait().then((receipt) => {
            this.claimTx = receipt.transactionHash;
          });
        });
      });
  }

  delegate(address: string) {
    if (this.tokenContract) {
      this.delegated = true;
      this.tokenContract['delegate'](address).then(
        (tx: ethers.providers.TransactionResponse) => {
          tx.wait().then((receipt) => {
            this.delegateAddress = address;
          });
        }
      );
    }
  }

  connectBallot(address: string) {
    this.ballotAddress = address;
    this.getBallotInfo(); 
  }

  getBallotInfo() {
    if (this.ballotAddress) {
      this.ballotContract = new ethers.Contract(
        this.ballotAddress,
        ballotJson.abi,
        this.wallet
      );
      for (let i = 0; i < 3; i++) {
        this.ballotContract['proposals'](i).then((result: any) => {
          this.proposalNames.push(ethers.utils.parseBytes32String(result.name));
        });
      }
    }
  }

  votePowerValue(power: string) {
    this.votePowerUsed = parseInt(power);
  }

  castVote(index: string) {
    if (this.ballotContract && this.votePowerUsed) {
      this.voted = true;
      this.ballotContract['vote'](parseInt(index), ethers.utils.parseEther((this.votePowerUsed).toString())).then(
        (tx: { wait: () => Promise<any>; }) => {
          tx.wait().then((receipt) => {
            this.voteIndex = index;
            this.voteTx = receipt.transactionHash;
          });
        }
      );
    }
  }
}
