import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TronClientService {
  constructor(private readonly http: HttpService) {}

  public async generateAddress(): Promise<GenerateAddressResult> {
    const { data } = await lastValueFrom(
      this.http.get<GenerateAddressResult>('/wallet/generateaddress'),
    );

    return data;
  }

  public async getAccountBalance(
    params: GetAccountBalanceParams,
  ): Promise<GetAccountBalanceResult> {
    const { data } = await lastValueFrom(
      this.http.post('/wallet/getaccountbalance', {
        account_identifier: params.accountIdentifier,
        block_identifier: params.blockIdentifier,
        visible: params.visible,
      }),
    );

    return {
      blockIdentifier: data.block_identifier,
      balance: data.balance,
    };
  }
}

export interface GenerateAddressResult {
  privateKey: string;
  address: string;
  hexAddress: string;
}

export interface GetAccountBalanceParams {
  accountIdentifier: {
    address: string;
  };
  blockIdentifier: {
    hash: string;
    number: number;
  };
  visible: boolean;
}

export interface GetAccountBalanceResult {
  balance: number;
  blockIdentifier: {
    hash: string;
    number: number;
  };
}
