import { Module } from '@nestjs/common';
import { Web3Service } from './services/web3.service';
import { LocalEnvService } from '../env/services/local-env.service';
import { LocalEnvPathEnum } from '../env/contants/local-env-path.enum';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Web3Service,
      useFactory: (env: LocalEnvService): Web3Service =>
        new Web3Service(env.getSafety(LocalEnvPathEnum.ETH_RPC_BASE_URL)),
      inject: [LocalEnvService],
    },
  ],
})
export class EthereumModule {}
