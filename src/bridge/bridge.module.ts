import { Module } from '@nestjs/common';
import { WalletModule } from '@app/wallet/wallet.module';
import { EthereumModule } from '@app/ethereum/ethereum.module';
import { BridgeController } from '@app/bridge/controller/bridge.controller';
import { AgentServiceFactory } from '@app/bridge/factories/agent-service.factory';
import { EncryptModule } from '@app/encrypt/encrypt.module';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { LoggerModule } from '@ledius/logger';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { ContractDeployController } from '@app/bridge/controller/contract-deploy.controller';

@Module({
  imports: [
    WalletModule,
    EthereumModule,
    EncryptModule,
    LoggerModule,
    LocalEnvModule,
    NetworkModule,
    TokenModule,
  ],
  controllers: [BridgeController, ContractDeployController],
  providers: [AgentServiceFactory],
  exports: [AgentServiceFactory],
})
export class BridgeModule {}
