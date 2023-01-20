import { Erc20Interface } from '@app/ethereum/interfaces/erc20.interface';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';
import { Token } from '@app/token/dao/entity/token';
import { Account } from 'web3-core';
import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';

export class Erc20ContractService implements Erc20Interface {
  constructor(
    private readonly web3: EthereumWeb3Service,
    private readonly token: Token,
  ) {}

  public async createWallet(): Promise<Account> {
    return this.web3.eth.accounts.create();
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
    privateKey: string,
  ): Promise<Balance> {
    return Promise.resolve(undefined);
  }

  public async getBalance(address: string): Promise<Balance> {
    return Promise.resolve(undefined);
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    return Promise.resolve(undefined);
  }

  public async transfer(
    fromPrivateKey: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    return Promise.resolve(undefined);
  }
}
