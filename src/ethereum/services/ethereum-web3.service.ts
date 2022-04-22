import Web3 from 'web3';
import { Eth } from 'web3-eth';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EthereumWeb3Service {
  private readonly web3: Web3;
  public readonly eth: Eth;

  constructor(private readonly host: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(host));
    this.eth = this.web3.eth;
  }
}