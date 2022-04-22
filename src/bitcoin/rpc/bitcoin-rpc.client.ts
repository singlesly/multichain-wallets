import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MAIN_WALLET } from '../constants';
import * as crypto from 'crypto';
import { ListUnspentResult } from '../interfaces/list-unspent-result';

@Injectable()
export class BitcoinRpcClient {
  constructor(private readonly http: HttpService) {}

  public async createWallet(
    name: string,
  ): Promise<{ name: string; warning: string }> {
    return this.rpcCall('createwallet', '', name);
  }

  public async loadWallet(
    name: string,
  ): Promise<{ name: string; warning: string }> {
    return this.rpcCall('loadwallet', '', name);
  }

  public async getNewAddress(label = ''): Promise<string> {
    return this.rpcCall('getnewaddress', `wallet/${MAIN_WALLET}`, label);
  }

  public async dumpPrivateKey(address: string): Promise<string> {
    return this.rpcCall('dumpprivkey', `wallet/${MAIN_WALLET}`, address);
  }

  public async uptime(): Promise<number> {
    return this.rpcCall('uptime', '');
  }

  public async getReceivedByAddress(
    address: string,
    minconf = 3,
  ): Promise<bigint> {
    const balance = await this.rpcCall<number>(
      'getreceivedbyaddress',
      'wallet/main',
      address,
      minconf,
    );

    return BigInt((balance * 10 ** 8).toFixed(0));
  }

  public async estimateSmartFee(minconf = 6): Promise<bigint> {
    const result = await this.rpcCall<{
      feerate: number;
      blocks: number;
      errors: string[];
    }>('estimatesmartfee', `wallet/${MAIN_WALLET}`, minconf);

    return BigInt((result.feerate * 10 ** 8).toFixed(0));
  }

  public async listUnspent(
    address: string,
    minconf = 6,
    maxconf = 9999999,
  ): Promise<ListUnspentResult<bigint>> {
    const list = await this.rpcCall<ListUnspentResult<number>>(
      'listunspent',
      `wallet/${MAIN_WALLET}`,
      minconf,
      maxconf,
      [address],
    );

    return list.map((item) => ({
      ...item,
      amount: BigInt(Number(item.amount * 10 ** 8).toFixed(0)),
    }));
  }

  public async createRawTransaction(
    recipientAddress: string,
    amount: bigint,
  ): Promise<string> {
    return this.rpcCall<string>(
      'createrawtransaction',
      `wallet/${MAIN_WALLET}`,
      [
        {
          txid: crypto
            .createHash('sha256')
            .update(Date.now().toString())
            .digest('hex'),
          vout: 0,
        },
      ],
      [
        {
          [recipientAddress]: Number(amount) * 10 ** -8,
        },
      ],
      0,
      true,
    );
  }

  public async signRawTransaction(
    transactionHex: string,
    privateKey: string,
  ): Promise<string> {
    const response = await this.rpcCall<{ hex: string; complete: boolean }>(
      'signrawtransactionwithkey',
      `wallet/${MAIN_WALLET}`,
      transactionHex,
      [privateKey],
    );

    return response.hex;
  }

  public async sendRawTransaction(
    signedTransactionHex: string,
  ): Promise<string> {
    return this.rpcCall<string>(
      'sendrawtransaction',
      `wallet/${MAIN_WALLET}`,
      signedTransactionHex,
    );
  }

  private async rpcCall<R>(
    method: string,
    url = '',
    ...params: unknown[]
  ): Promise<R> {
    const response = await lastValueFrom(
      this.http.post<{ result: R }>(url, {
        jsonrpc: '1.0',
        id: 'crypto-bridge',
        method,
        params,
      }),
    );

    return response.data.result as R;
  }
}
