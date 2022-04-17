import { Injectable } from '@nestjs/common';
import { TemporaryWalletService } from '../temporary-wallet.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { ModuleRef } from '@nestjs/core';
import { BitcoinTemporaryWalletService } from '../services/bitcoin-temporary-wallet.service';

@Injectable()
export class TemporaryWalletServiceFactory {
  private static readonly supportedMap = {
    [NetworkEnum.BTC]: {
      [CoinEnum.BTC]: BitcoinTemporaryWalletService,
    },
  };

  constructor(private readonly moduleRef: ModuleRef) {}

  public for(
    network: NetworkEnum,
    coin: CoinEnum = network as unknown as CoinEnum,
  ): TemporaryWalletService {
    const temporaryWalletService =
      TemporaryWalletServiceFactory.supportedMap[network]?.[coin];

    if (!temporaryWalletService) {
      throw new Error(`Unsupported ${network}:${coin}`);
    }

    return this.moduleRef.get(temporaryWalletService);
  }
}
