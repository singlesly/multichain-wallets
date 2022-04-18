import { Module } from '@nestjs/common';
import { HealthController } from './controller/health.controller';
import { BitcoinModule } from '../bitcoin/bitcoin.module';
import { EthereumModule } from '../ethereum/ethereum.module';
import { LoggerModule } from '@ledius/logger';

@Module({
  imports: [BitcoinModule, EthereumModule, LoggerModule],
  controllers: [HealthController],
})
export class HealthModule {}
