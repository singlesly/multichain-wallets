import { Injectable } from '@nestjs/common';
import { TemporaryWalletService } from '../temporary-wallet.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { BitcoinTemporaryWalletService } from '../services/bitcoin-temporary-wallet.service';

@Injectable()
export class TemporaryWalletServiceFactory {
  public readonly supportedMap = {
    [NetworkEnum.BTC]: {
      [CoinEnum.BTC]: this.bitcoinTemporaryWalletService,
    },
  };

  constructor(
    private readonly bitcoinTemporaryWalletService: BitcoinTemporaryWalletService,
  ) {}

  public for(
    network: NetworkEnum,
    coin: CoinEnum = network as unknown as CoinEnum,
  ): TemporaryWalletService {
    const temporaryWalletService = this.supportedMap[network]?.[coin];

    if (!temporaryWalletService) {
      throw new Error(`Unsupported ${network}:${coin}`);
    }

    return temporaryWalletService;
  }
}
