import { Injectable } from '@nestjs/common';
import { AgentService } from '@app/bridge/services/agent.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { BitcoinAgentService } from '../services/bitcoin-agent.service';
import { EthereumAgentService } from '../services/ethereum-agent.service';
import { TronAgentService } from '../services/tron-agent.service';
import { UsdtTrc20AgentService } from '@app/bridge/services/usdt-trc20-agent.service';

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
      [CoinEnum.USDT]: this.usdtTrc20AgentService,
    },
  };

  constructor(
    private readonly bitcoinAgentService: BitcoinAgentService,
    private readonly ethereumAgentService: EthereumAgentService,
    private readonly tronAgentService: TronAgentService,
    private readonly usdtTrc20AgentService: UsdtTrc20AgentService,
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
