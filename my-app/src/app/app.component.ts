import { Component } from '@angular/core';
import { ethers } from 'ethers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  provider: ethers.providers.Provider;
  wallet: ethers.Wallet | undefined;

  constructor() {
    this.provider = ethers.providers.getDefaultProvider('goerli');
  }

  createWallet() {
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
  }
}
