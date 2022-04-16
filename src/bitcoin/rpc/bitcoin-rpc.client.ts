import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BitcoinRpcClient {
  constructor(private readonly http: HttpService) {}

  public async createWallet(
    name: string,
  ): Promise<{ name: string; warning: string }> {
    return this.rpcCall('createwallet', name);
  }

  public async getNewAddress(label = ''): Promise<string> {
    return this.rpcCall('getnewaddress', label);
  }

  public dumpPrivateKey(address: string): Promise<string> {
    return this.rpcCall('dumpprivkey', address);
  }

  private async rpcCall<R>(method: string, ...params: unknown[]): Promise<R> {
    const response = await lastValueFrom(
      this.http.post<{ result: R }>('', {
        jsonrpc: '1.0',
        id: 'crypto-bridge',
        method,
        params,
      }),
    );

    return response.data.result as R;
  }
}
