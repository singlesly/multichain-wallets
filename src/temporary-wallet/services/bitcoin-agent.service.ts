import { Injectable } from '@nestjs/common';
import { BitcoinRpcClient } from '../../bitcoin/rpc/bitcoin-rpc.client';
import { AgentService, Balance, TransactionInfo, TxID } from '../agent.service';
import { CreateTemporaryWalletService } from './create-temporary-wallet.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { GetTemporaryWalletService } from './get-temporary-wallet.service';
import { EncryptService } from '../../encrypt/services/encrypt.service';
import { TemporaryWallet } from '../dao/entity/temporary-wallet';

@Injectable()
export class BitcoinAgentService implements AgentService {
  constructor(
    private readonly bitcoinRpcClient: BitcoinRpcClient,
    private readonly createTemporaryWalletService: CreateTemporaryWalletService,
    private readonly getTemporaryWalletService: GetTemporaryWalletService,
    private readonly encryptService: EncryptService,
  ) {}

  public async createWallet(): Promise<TemporaryWallet> {
    const address = await this.bitcoinRpcClient.getNewAddress();
    const privateKey = await this.bitcoinRpcClient.dumpPrivateKey(address);

    return await this.createTemporaryWalletService.create({
      pubKey: address,
      privateKey: privateKey,
      network: NetworkEnum.BTC,
      coin: CoinEnum.BTC,
    });
  }

  public async getBalance(address: string): Promise<Balance> {
    const amount = await this.bitcoinRpcClient.getReceivedByAddress(address, 3);

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
