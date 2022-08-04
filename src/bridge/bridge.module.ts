import { Module } from '@nestjs/common';
import { WalletModule } from '@app/wallet/wallet.module';
import { TronModule } from '@app/tron/tron.module';
import { EthereumModule } from '@app/ethereum/ethereum.module';
import { BitcoinModule } from '@app/bitcoin/bitcoin.module';
import { BridgeController } from '@app/bridge/controller/bridge.controller';
import { AgentServiceFactory } from '@app/bridge/factories/agent-service.factory';
import { BitcoinAgentService } from '@app/bridge/services/bitcoin-agent.service';
import { EthereumAgentService } from '@app/bridge/services/ethereum-agent.service';
import { TronAgentService } from '@app/bridge/services/tron-agent.service';
import { EncryptModule } from '@app/encrypt/encrypt.module';
import { UsdtTrc20Module } from '@app/usdt-trc20/usdt-trc20.module';
import { UsdtTrc20AgentService } from '@app/bridge/services/usdt-trc20-agent.service';
import { TronNetworkExceptionFactory } from '@app/common/exceptions/tron-network-exception.factory';
import { EnvModule } from '@app/env/env.module';

@Module({
  imports: [
    WalletModule,
    TronModule,
    EthereumModule,
    BitcoinModule,
    EncryptModule,
    UsdtTrc20Module,
    EnvModule,
  ],
  controllers: [BridgeController],
  providers: [
    AgentServiceFactory,
    BitcoinAgentService,
    EthereumAgentService,
    TronAgentService,
    UsdtTrc20AgentService,
    TronNetworkExceptionFactory,
  ],
})
export class BridgeModule {}
