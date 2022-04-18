import { Module } from '@nestjs/common';
import { HealthController } from './controller/health.controller';
import { BitcoinModule } from '../bitcoin/bitcoin.module';

@Module({
  imports: [BitcoinModule],
  controllers: [HealthController],
})
export class HealthModule {}
