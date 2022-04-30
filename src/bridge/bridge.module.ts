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

@Module({
  imports: [
    WalletModule,
    TronModule,
    EthereumModule,
    BitcoinModule,
    EncryptModule,
  ],
  controllers: [BridgeController],
  providers: [
    AgentServiceFactory,
    BitcoinAgentService,
    EthereumAgentService,
    TronAgentService,
  ],
})
export class BridgeModule {}
