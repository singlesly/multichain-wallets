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
}

export interface GenerateAddressResult {
  privateKey: string;
  address: string;
  hexAddress: string;
}
