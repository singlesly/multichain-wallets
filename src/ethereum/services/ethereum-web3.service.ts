import Web3 from 'web3';
import * as utils from 'web3-utils';
import { Injectable } from '@nestjs/common';
import { Web3EthInterface } from 'web3/src/types';

@Injectable()
export class EthereumWeb3Service {
  private readonly web3: Web3;
  public readonly eth: Web3EthInterface;
  public readonly utils: typeof utils;

  constructor(private readonly host: string) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(host));
    this.eth = this.web3.eth;
    this.utils = this.web3.utils;
  }
}
