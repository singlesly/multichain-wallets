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

  public async getAccount(hexAddress: string): Promise<GetAccountResult> {
    const { data } = await lastValueFrom(
      this.http.post('/wallet/getaccount', {
        address: hexAddress,
      }),
    );

    return {
      address: data.address ?? hexAddress,
      balance: data.balance ? BigInt(data.balance) : BigInt(0),
    };
  }

  public async getNowBlock(): Promise<GetNowBlockResult> {
    const { data } = await lastValueFrom(
      this.http.get<GetNowBlockResult>('/wallet/getnowblock'),
    );

    return data;
  }

  public async easyTransferByPrivate(
    params: EasyTransferByPrivateParams,
  ): Promise<EasyTransferByPrivateResult> {
    const { data } = await lastValueFrom(
      this.http.post<EasyTransferByPrivateResult>(
        '/wallet/easytransferbyprivate',
        {
          ...params,
          amount: Number(params.amount),
        },
      ),
    );

    return data;
  }

  public async getAccountNet(hexAddress: string): Promise<GetAccountNetResult> {
    const { data } = await lastValueFrom(
      this.http.post('/wallet/getaccountnet', { address: hexAddress }),
    );

    return data;
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

export interface GetAccountResult {
  address: string;
  balance: bigint;
}

export interface GetNowBlockResult {
  blockID: string;
}

export interface EasyTransferByPrivateParams {
  readonly privateKey: string;
  readonly toAddress: string;
  readonly amount: bigint;
}

export interface EasyTransferByPrivateResult {
  transaction: {
    txID: string;
  };
}

export interface GetAccountNetResult {}
