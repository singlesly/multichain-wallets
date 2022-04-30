import { Module } from '@nestjs/common';
import { TronModule } from '@app/tron/tron.module';

@Module({
  imports: [TronModule],
})
export class USDTModule {}
