import { Module } from '@nestjs/common';
import { HealthController } from './controller/health.controller';
import { BitcoinModule } from '../bitcoin/bitcoin.module';
import { EthereumModule } from '../ethereum/ethereum.module';
import { LoggerModule } from '@ledius/logger';
import { TronModule } from '../tron/tron.module';

@Module({
  imports: [BitcoinModule, EthereumModule, TronModule, LoggerModule],
  controllers: [HealthController],
})
export class HealthModule {}
