import { Erc20Interface } from '@app/ethereum/interfaces/erc20.interface';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';
import { Token } from '@app/token/dao/entity/token';
import { Account } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import {
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/interfaces/agent-service.interface';
import { ForbiddenException } from '@nestjs/common';

export class Erc20ContractService implements Erc20Interface {
  private readonly contract: Contract;
  constructor(
    private readonly web3: EthereumWeb3Service,
    private readonly token: Token,
  ) {
    if (!this.token.contractAddress) {
      throw new ForbiddenException('Contract address not found');
    }
    this.contract = new this.web3.eth.Contract(
      token.getAbi(),
      this.token.contractAddress,
    );
  }

  public async createWallet(): Promise<Account> {
    return this.web3.eth.accounts.create();
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    const fee = await this.web3.eth.estimateGas({
      from,
      to,
      value: String(amount),
      gasPrice: await this.web3.eth.getGasPrice(),
    });

    return {
      amount: BigInt(fee.toString(10)),
      decimals: this.token.decimals,
    };
  }

  public async getBalance(address: string): Promise<Balance> {
    const balance = await this.contract.methods.balanceOf(address).call();

    return {
      amount: BigInt(balance),
      decimals: this.token.decimals,
    };
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const tx = await this.web3.eth.getTransaction(id);
    const currentBlock = await this.web3.eth.getBlockNumber();

    return {
      amount: BigInt(tx.value.toString()),
      from: tx.from,
      confirmations: tx.blockNumber ? currentBlock - tx.blockNumber : 0,
      isConfirmed: tx.blockNumber ? currentBlock - tx.blockNumber >= 20 : false,
      transactionId: id,
      to: String(tx.to),
    };
  }

  public async transfer(
    fromPrivateKey: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    const account = this.web3.eth.accounts.privateKeyToAccount(fromPrivateKey);
    this.web3.eth.accounts.wallet.add(account);
    const receipt = await this.contract.methods.transfer(to, amount).send({
      from: account.address,
      gasPrice: await this.web3.eth.getGasPrice(),
      gas: await this.web3.eth.estimateGas({ from: account.address }),
    });

    return receipt.transactionhash;
  }
}
