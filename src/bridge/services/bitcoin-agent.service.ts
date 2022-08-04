import { Injectable } from '@nestjs/common';
import { BitcoinRpcClient } from '@app/bitcoin/rpc/bitcoin-rpc.client';
import {
  AgentService,
  Balance,
  TransactionInfo,
  TxID,
} from '@app/bridge/services/agent.service';
import { CreateWalletService } from '@app/wallet/services/create-wallet.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';
import { EncryptService } from '@app/encrypt/services/encrypt.service';
import { Wallet } from '@app/wallet/dao/entity/wallet';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

const ECPair = ECPairFactory(ecc);

@Injectable()
export class BitcoinAgentService implements AgentService {
  constructor(
    private readonly bitcoinRpcClient: BitcoinRpcClient,
    private readonly createTemporaryWalletService: CreateWalletService,
    private readonly getTemporaryWalletService: GetWalletService,
    private readonly encryptService: EncryptService,
  ) {}

  public async createWallet(): Promise<Wallet> {
    const address = await this.bitcoinRpcClient.getNewAddress();

    return await this.createTemporaryWalletService.create({
      pubKey: address,
      privateKey: '',
      network: NetworkEnum.BTC,
      coin: CoinEnum.BTC,
    });
  }

  public async getBalance(address: string): Promise<Balance> {
    const amount = await this.bitcoinRpcClient.getReceivedByAddress(address, 0);

    return {
      amount,
      decimals: 8,
    };
  }

  public async transfer(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<TxID> {
    const wallet = await this.getTemporaryWalletService.getByAddress(from);

    const transactionHash = await this.bitcoinRpcClient.createRawTransaction(
      to,
      amount,
    );

    const fundedTransactionHash =
      await this.bitcoinRpcClient.fundRawTransaction(transactionHash, {
        changeAddress: wallet.pubKey,
        changePosition: 0,
        includeWatching: true,
      });

    const signedTransactionHex =
      await this.bitcoinRpcClient.signRawTransactionWithWallet(
        fundedTransactionHash,
      );

    return await this.bitcoinRpcClient.sendRawTransaction(signedTransactionHex);
  }

  public async estimateFee(
    from: string,
    to: string,
    amount: bigint,
  ): Promise<Balance> {
    const transactionHash = await this.bitcoinRpcClient.createRawTransaction(
      to,
      amount,
    );

    const fundedTransactionHash =
      await this.bitcoinRpcClient.fundRawTransaction(transactionHash, {
        changeAddress: from,
        changePosition: 0,
        includeWatching: true,
      });

    const decodedFundedTransaction =
      await this.bitcoinRpcClient.decodeRawTransaction(fundedTransactionHash);

    const fee = await this.bitcoinRpcClient.estimateSmartFee();

    return {
      amount: BigInt(decodedFundedTransaction.vsize.toFixed(0)) * fee,
      decimals: 8,
    };
  }

  public async getTransaction(id: string): Promise<TransactionInfo> {
    const transaction = await this.bitcoinRpcClient.getRawTransaction(id);

    const firstAddress = transaction.vout[0]?.scriptPubKey.address || '';
    const lastAddress =
      transaction.vout[transaction.vout.length - 1]?.scriptPubKey.address ?? '';

    const amount = Number(
      transaction.vout[transaction.vout.length - 1].value * 10 ** 8,
    ).toFixed(0);

    return {
      transactionId: transaction.txid,
      confirmations: transaction.confirmations,
      amount: BigInt(amount),
      to: firstAddress,
      from: lastAddress,
    };
  }
}
