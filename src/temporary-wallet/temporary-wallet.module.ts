import { Module } from '@nestjs/common';
import { AgentServiceFactory } from './factories/agent-service.factory';
import { BitcoinModule } from '../bitcoin/bitcoin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemporaryWallet } from './dao/entity/temporary-wallet';
import { BridgeController } from './controller/bridge.controller';
import { BitcoinAgentService } from './services/bitcoin-agent.service';
import { CreateTemporaryWalletService } from './services/create-temporary-wallet.service';
import { TemporaryWalletPgRepository } from './repositories/temporary-wallet-pg.repository';
import { WalletController } from './controller/wallet.controller';
import { EthereumModule } from '../ethereum/ethereum.module';
import { EthereumAgentService } from './services/ethereum-agent.service';
import { EncryptModule } from '../encrypt/encrypt.module';
import { GetTemporaryWalletService } from './services/get-temporary-wallet.service';
import { TronModule } from '../tron/tron.module';
import { TronAgentService } from './services/tron-agent.service';

@Module({
  imports: [
    BitcoinModule,
    EthereumModule,
    TypeOrmModule.forFeature([TemporaryWallet]),
    EncryptModule,
    TronModule,
  ],
  controllers: [BridgeController, WalletController],
  providers: [
    AgentServiceFactory,
    BitcoinAgentService,
    EthereumAgentService,
    CreateTemporaryWalletService,
    TemporaryWalletPgRepository,
    GetTemporaryWalletService,
    TronAgentService,
  ],
})
export class TemporaryWalletModule {}
