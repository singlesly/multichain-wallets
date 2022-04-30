import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import TronWeb from 'tronweb';

@Injectable()
export class TronClientService {
  constructor(
    private readonly http: HttpService,
    private readonly tronWeb: TronWeb,
  ) {}

  public async generateAddress(): Promise<GenerateAddressResult> {
    const account = await this.tronWeb.createAccount();

    return {
      address: account.address.base58,
      hexAddress: account.address.hex,
      privateKey: account.privateKey,
    };
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

  public async createTransaction(
    params: CreateTransactionParams,
  ): Promise<CreateTransactionResult> {
    const { data } = await lastValueFrom(
      this.http.post('/wallet/createtransaction', {
        to_address: params.toAddress,
        owner_address: params.ownerAddress,
        amount: Number(params.amount),
      }),
    );

    return data;
  }

  public async getTransactionInfoById(
    id: string,
  ): Promise<GetTransactionInfoResult> {
    const { data } = await lastValueFrom(
      this.http.post('/wallet/gettransactioninfobyid', {
        value: id,
      }),
    );

    return data;
  }

  public async triggerSmartContract(
    params: TriggerSmartContractParams,
  ): Promise<TriggerSmartContractResult> {
    const { data } = await lastValueFrom(
      this.http.post('/wallet/triggersmartcontract', {
        owner_address: params.ownerAddress,
        contract_address: params.contractAddress,
        function_selector: params.functionSelector,
        parameter: params.parameter,
      }),
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

export interface CreateTransactionParams {
  readonly toAddress: string;
  readonly ownerAddress: string;
  readonly amount: bigint;
}

export interface CreateTransactionResult {
  readonly txID: string;
  readonly raw_data: {
    ref_block_bytes: string;
  };
  readonly raw_data_hex: string;
}

export interface GetTransactionInfoResult {}

export interface TriggerSmartContractParams {
  readonly ownerAddress: string;
  readonly contractAddress: string;
  readonly functionSelector: string;
  readonly parameter: string;
}

export interface TriggerSmartContractResult {}
