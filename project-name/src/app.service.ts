import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

export class PaymentOrderModel {
  id: number;
  secret: string;
  value: number;
}

@Injectable()
export class AppService {
  provider: ethers.providers.Provider;
  paymentOrders: PaymentOrderModel[];

  constructor(private configService: ConfigService) {
    this.provider = ethers.getDefaultProvider('goerli');
    this.paymentOrders = [];
  }

  getBlock(blockHashorBlockTag: string): Promise<ethers.providers.Block> {
    return this.provider.getBlock(blockHashorBlockTag);
  }

  async getTotalSupply(address: string) {
    const contract = new ethers.Contract(address, tokenJson.abi, this.provider);
    const bn = await contract.totalSupply();
    return ethers.utils.formatEther(bn);
  }

  async getAllowance(address: string, owner: string, spender: string) {
    const contract = new ethers.Contract(address, tokenJson.abi, this.provider);
    const bn = await contract.totalSupply(owner, spender);
    return ethers.utils.formatEther(bn);
  }

  getPaymentOrder(id: number) {
    return { id: id, value: this.paymentOrders[id].value };
  }

  createPaymentOrder(secret: string, value: number) {
    const newPaymentOrder = new PaymentOrderModel();
    newPaymentOrder.secret = secret;
    newPaymentOrder.value = value;
    newPaymentOrder.id = this.paymentOrders.length;
    this.paymentOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }

  async claimPaymentOrder(id: number, secret: string, address: string) {
    if (this.paymentOrders[id].secret != secret)
      throw new HttpException('Wrong Secret!', 403);
    const seed = this.configService.get<string>('MNEMONIC');
    const contractAddress = this.configService.get<string>('CONTRACT');
    const wallet = ethers.Wallet.fromMnemonic(seed);
    const signer = wallet.connect(this.provider);
    const signedContract = new ethers.Contract(
      contractAddress,
      tokenJson.abi,
      signer,
    );
    const tx = await signedContract.mint(
      address,
      ethers.utils.parseEther(this.paymentOrders[id].value.toString()),
    );
    return tx.wait();
  }
}
