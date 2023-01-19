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
import { TronNetworkExceptionFactory } from '@app/common/exceptions/tron-network-exception.factory';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { LoggerModule } from '@ledius/logger';
import { VirtualBalanceModule } from '@app/virtual-balance/virtual-balance.module';
import { VirtualTransactionModule } from '@app/virtual-transaction/virtual-transaction.module';
import { VirtualAgentServiceFactory } from '@app/bridge/factories/virtual-agent-service.factory';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';

@Module({
  imports: [
    WalletModule,
    TronModule,
    EthereumModule,
    BitcoinModule,
    EncryptModule,
    LoggerModule,
    LocalEnvModule,
    VirtualBalanceModule,
    VirtualTransactionModule,
    NetworkModule,
    TokenModule,
  ],
  controllers: [BridgeController],
  providers: [
    AgentServiceFactory,
    BitcoinAgentService,
    EthereumAgentService,
    TronAgentService,
    TronNetworkExceptionFactory,
    VirtualAgentServiceFactory,
  ],
})
export class BridgeModule {}
