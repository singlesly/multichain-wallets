import { Injectable } from '@nestjs/common';
import { AgentService } from '@app/bridge/services/agent.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { BitcoinAgentService } from '../services/bitcoin-agent.service';
import { EthereumAgentService } from '../services/ethereum-agent.service';
import { TronAgentService } from '../services/tron-agent.service';
import { UsdtTrc20AgentService } from '@app/bridge/services/usdt-trc20-agent.service';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { ModuleRef } from '@nestjs/core';
import { VirtualAgentServiceFactory } from '@app/bridge/factories/virtual-agent-service.factory';

@Injectable()
export class AgentServiceFactory {
  public readonly supportedMap = {
    [NetworkEnum.BTC]: {
      [CoinEnum.BTC]: BitcoinAgentService,
    },
    [NetworkEnum.ETH]: {
      [CoinEnum.ETH]: EthereumAgentService,
    },
    [NetworkEnum.TRON]: {
      [CoinEnum.TRX]: TronAgentService,
      [CoinEnum.USDT]: UsdtTrc20AgentService,
    },
  };

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly virtualAgentServiceFactory: VirtualAgentServiceFactory,
  ) {}

  public for(
    network: NetworkEnum,
    coin: CoinEnum = network as unknown as CoinEnum,
  ): AgentService {
    const agentService =
      this.supportedMap[network.toUpperCase()]?.[coin.toUpperCase()];

    if (!agentService) {
      throw new BaseException({
        message: `Unsupported ${network}:${coin}`,
        statusCode: WebErrorsEnum.INVALID_ARGUMENT,
      });
    }

    const resolveAgent = this.moduleRef.get(agentService);

    return this.virtualAgentServiceFactory.for(resolveAgent);
  }
}
