import { Injectable, NotImplementedException } from '@nestjs/common';
import { TemporaryWalletService } from '../temporary-wallet.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';

@Injectable()
export class TemporaryWalletServiceFactory {
  constructor() {}

  public for(
    network: NetworkEnum,
    coin: CoinEnum = network,
  ): TemporaryWalletService {
    throw new NotImplementedException();
  }
}
