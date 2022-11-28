import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json';
import ballotJson from '../assets/Ballot.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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



  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider("goerli");
    this.proposalNames = [];
  }

  createWallet() {
    this.http
    .get<any>('http://localhost:3000/token-address')
    .subscribe((ans) => {
      this.tokenAddress = ans.result;
      if(this.tokenAddress) {
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        this.tokenContract = new ethers.Contract(
          this.tokenAddress, 
          tokenJson.abi, 
          this.wallet
        );
        this.wallet.getBalance().then((balanceBN: ethers.BigNumberish) => {
          this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
        });
        this.tokenContract["balanceOf"](this.wallet.address).then((balanceBN: ethers.BigNumberish) => {
          this.tokenBalance = parseFloat(ethers.utils.formatEther(balanceBN));
        });
        this.tokenContract["getVotes"](this.wallet.address).then((votesBN: ethers.BigNumberish) => {
          this.votePower = parseFloat(ethers.utils.formatEther(votesBN));
        });
      }
    });
  }

  importing() {
    this.importInit = true;
  }

  importWallet(key: string) {
    this.http
    .get<any>('http://localhost:3000/token-address')
    .subscribe((ans) => {
      this.tokenAddress = ans.result;
      if(this.tokenAddress) {
        this.wallet = new ethers.Wallet(key).connect(this.provider);
        this.tokenContract = new ethers.Contract(
          this.tokenAddress, 
          tokenJson.abi, 
          this.wallet
        );
        this.wallet.getBalance().then((balanceBN: ethers.BigNumberish) => {
          this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
        });
        this.tokenContract["balanceOf"](this.wallet.address).then((balanceBN: ethers.BigNumberish) => {
          this.tokenBalance = parseFloat(ethers.utils.formatEther(balanceBN));
        });
        this.tokenContract["getVotes"](this.wallet.address).then((votesBN: ethers.BigNumberish) => {
          this.votePower = parseFloat(ethers.utils.formatEther(votesBN));
        });
      }
    });
  }

  claimTokens() {
    this.http.post<any>('http://localhost:3000/claim-tokens-order', {
      address: this.wallet?.address,
    })
    .subscribe((ans) => {
      const txHash = ans.result;
      this.provider.getTransaction(txHash).then((tx) => {
        tx.wait().then((receipt) => {
          
        })
      });
    });
  }

  delegate(address: string) {
    if(this.tokenContract){
      this.tokenContract["delegate"](address).then((tx: ethers.providers.TransactionResponse) => {
        tx.wait().then((receipt) => {
          this.delegateAddress = address;
        });
      });
    }
  }

  connectBallot(address: string) {
    this.ballotAddress = address;
    this.getBallotInfo(); //ballot contract address
  }

  getBallotInfo() {
    if(this.ballotAddress){
      this.ballotContract = new ethers.Contract(
        this.ballotAddress, 
        ballotJson.abi, 
        this.wallet
      );
      for(let i = 0; i<3; i++){
        this.ballotContract["proposals"](i).then((result: any) => {
          this.proposalNames.push(ethers.utils.parseBytes32String(result.name));
        });
      }
    }
  }

  votePowerValue(power: string) {
    this.votePower = parseInt(power);
  }

  castVote(index: string) {
    if(this.ballotContract){
      this.ballotContract["vote"](parseInt(index), this.votePower).then((tx: ethers.providers.TransactionResponse) => {
        tx.wait().then((receipt) => {
          this.voteIndex = index;
          this.voteTx = receipt.transactionHash;
        });
      });
    }
  }

}
