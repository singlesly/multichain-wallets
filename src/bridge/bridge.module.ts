import { Module } from '@nestjs/common';
import { WalletModule } from '@app/wallet/wallet.module';
import { TronModule } from '@app/tron/tron.module';
import { EthereumModule } from '@app/ethereum/ethereum.module';
import { BitcoinModule } from '@app/bitcoin/bitcoin.module';
import { BridgeController } from '@app/bridge/controller/bridge.controller';
import { AgentServiceFactory } from '@app/bridge/factories/agent-service.factory';
import { BitcoinAgentService } from '@app/bridge/services/bitcoin-agent.service';
import { EncryptModule } from '@app/encrypt/encrypt.module';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { LoggerModule } from '@ledius/logger';
import { VirtualBalanceModule } from '@app/virtual-balance/virtual-balance.module';
import { VirtualTransactionModule } from '@app/virtual-transaction/virtual-transaction.module';
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
  providers: [AgentServiceFactory, BitcoinAgentService],
  exports: [AgentServiceFactory],
})
export class BridgeModule {}
