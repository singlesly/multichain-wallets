import { Module } from '@nestjs/common';
import { TronModule } from '@app/tron/tron.module';
import { USDT_CONTRACT } from '@app/usdt-trc20/constants';
import TronWeb, { TRC20Contract } from 'tronweb';
import { USDTClientService } from '@app/usdt-trc20/services/usdt-client.service';
import { LocalEnvService } from '@app/env/services/local-env.service';
import { EnvModule } from '@app/env/env.module';

@Module({
  imports: [TronModule, EnvModule],
  providers: [
    USDTClientService,
    {
      provide: USDT_CONTRACT,
      useFactory: async (
        tronWeb: TronWeb,
        env: LocalEnvService,
      ): Promise<TRC20Contract> => {
        return tronWeb.contract().at(env.getUsdtContractAddress());
      },
      inject: [TronWeb, LocalEnvService],
    },
  ],
  exports: [USDTClientService],
})
export class UsdtTrc20Module {}
