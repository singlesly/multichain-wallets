import { Module } from '@nestjs/common';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { EthereumCompatibleFactory } from '@app/ethereum/services/ethereum-compatible.factory';

@Module({
  imports: [LocalEnvModule],
  providers: [EthereumCompatibleFactory],
  exports: [EthereumCompatibleFactory],
})
export class EthereumModule {}
