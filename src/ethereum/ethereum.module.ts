import { Module } from '@nestjs/common';
import { LocalEnvModule } from '@app/local-env/local-env.module';
import { EthereumCompatibleFactory } from '@app/ethereum/services/ethereum-compatible.factory';
import { DeploySmartContractService } from './services/deploy-smart-contract.service';

@Module({
  imports: [LocalEnvModule],
  providers: [EthereumCompatibleFactory, DeploySmartContractService],
  exports: [EthereumCompatibleFactory, DeploySmartContractService],
})
export class EthereumModule {}
