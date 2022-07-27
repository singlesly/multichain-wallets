import { Module } from '@nestjs/common';
import { EthereumWeb3Service } from './services/ethereum-web3.service';
import { LocalEnvService } from '../env/services/local-env.service';
import { LocalEnvPathEnum } from '../env/contants/local-env-path.enum';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: EthereumWeb3Service,
      useFactory: (env: LocalEnvService): EthereumWeb3Service =>
        new EthereumWeb3Service(
          env.getSafety(LocalEnvPathEnum.ETH_RPC_BASE_URL),
          env.getSafety(LocalEnvPathEnum.ETH_RPC_AUTH_USERNAME),
          env.getSafety(LocalEnvPathEnum.ETH_RPC_AUTH_PASSWORD),
        ),
      inject: [LocalEnvService],
    },
  ],
  exports: [EthereumWeb3Service],
})
export class EthereumModule {}
