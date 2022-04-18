import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { MAIN_WALLET } from '../constants';

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
