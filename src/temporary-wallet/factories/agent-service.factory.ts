import { Injectable } from '@nestjs/common';
import { AgentService } from '../agent.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { BitcoinAgentService } from '../services/bitcoin-agent.service';
import { EthereumAgentService } from '../services/ethereum-agent.service';
import { TronAgentService } from '../services/tron-agent.service';

@Injectable()
export class AgentServiceFactory {
  public readonly supportedMap = {
    [NetworkEnum.BTC]: {
      [CoinEnum.BTC]: this.bitcoinAgentService,
    },
    [NetworkEnum.ETH]: {
      [CoinEnum.ETH]: this.ethereumAgentService,
    },
    [NetworkEnum.TRON]: {
      [CoinEnum.TRON]: this.tronAgentService,
    },
  };

  constructor(
    private readonly bitcoinAgentService: BitcoinAgentService,
    private readonly ethereumAgentService: EthereumAgentService,
    private readonly tronAgentService: TronAgentService,
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
