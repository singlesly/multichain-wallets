import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { LocalEnvService } from '../env/services/local-env.service';
import { LocalEnvPathEnum } from '../env/contants/local-env-path.enum';
import { TronWeb3Service } from './services/tron-web3.service';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: TronWeb3Service,
      useFactory: (env: LocalEnvService): TronWeb3Service =>
        new TronWeb3Service(env.getSafety(LocalEnvPathEnum.TRON_RPC_BASE_URL)),
      inject: [LocalEnvService],
    },
  ],
  exports: [TronWeb3Service],
})
export class TronModule {}
