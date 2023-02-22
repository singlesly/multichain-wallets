import { Erc20Interface } from '@app/ethereum/interfaces/erc20.interface';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';
import { Token } from '@app/token/dao/entity/token';
import { Account } from 'web3-core';
import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
import { NotImplementedException } from '@nestjs/common';

export class Erc20ContractService implements Erc20Interface {
  constructor(
    private readonly web3: EthereumWeb3Service,
    private readonly token: Token,
  ) {}

  public async createWallet(): Promise<Account> {
    return this.web3.eth.accounts.create();
  }

  public async estimateFee(): Promise<Balance> {
    throw new NotImplementedException();
  }

  public async getBalance(): Promise<Balance> {
    throw new NotImplementedException();
  }

  public async getTransaction(): Promise<TransactionInfo> {
    throw new NotImplementedException();
  }

  public async transfer(): Promise<TxID> {
    throw new NotImplementedException();
  }
}
