import Web3 from 'web3';
import { Eth } from 'web3-eth';
import { Utils } from 'web3-utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EthereumWeb3Service {
  private readonly web3: Web3;
  public readonly eth: Eth;
  public readonly utils: Utils;

  constructor(private readonly host: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(host));
    this.eth = this.web3.eth;
    this.utils = this.web3.utils;
  }
}
