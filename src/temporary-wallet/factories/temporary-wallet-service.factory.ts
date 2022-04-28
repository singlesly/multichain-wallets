import { Injectable } from '@nestjs/common';
import { AgentService } from '../agent.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { BitcoinTemporaryWalletService } from '../services/bitcoin-temporary-wallet.service';
import { EthereumTemporaryWalletService } from '../services/ethereum-temporary-wallet.service';
import { TronTemporaryWalletService } from '../services/tron-temporary-wallet.service';

@Injectable()
export class TemporaryWalletServiceFactory {
  public readonly supportedMap = {
    [NetworkEnum.BTC]: {
      [CoinEnum.BTC]: this.bitcoinTemporaryWalletService,
    },
    [NetworkEnum.ETH]: {
      [CoinEnum.ETH]: this.ethereumTemporaryWalletService,
    },
    [NetworkEnum.TRON]: {
      [CoinEnum.TRON]: this.tronTemporaryWalletService,
    },
  };

  constructor(
    private readonly bitcoinTemporaryWalletService: BitcoinTemporaryWalletService,
    private readonly ethereumTemporaryWalletService: EthereumTemporaryWalletService,
    private readonly tronTemporaryWalletService: TronTemporaryWalletService,
  ) {}

  public for(
    network: NetworkEnum,
    coin: CoinEnum = network as unknown as CoinEnum,
  ): AgentService {
    const temporaryWalletService =
      this.supportedMap[network.toUpperCase()]?.[coin.toUpperCase()];

    if (!temporaryWalletService) {
      throw new Error(`Unsupported ${network}:${coin}`);
    }

    return temporaryWalletService;
  }
}
