import { Module } from '@nestjs/common';
import { TronModule } from '@app/tron/tron.module';
import { USDT_CONTRACT } from '@app/usdt-trc20/constants';
import TronWeb, { TRC20Contract } from 'tronweb';
import { USDTClientService } from '@app/usdt-trc20/services/usdt-client.service';
import { LocalEnvService } from '@app/env/services/local-env.service';
import { EnvModule } from '@app/env/env.module';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

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
        try {
          const contract = await tronWeb
            .contract()
            .at(env.getUsdtContractAddress());
          return contract;
        } catch (e) {
          throw new BaseException({
            message: 'Undefined contract error',
            statusCode: WebErrorsEnum.INTERNAL_ERROR,
          });
        }
      },
      inject: [TronWeb, LocalEnvService],
    },
  ],
  exports: [USDTClientService],
})
export class UsdtTrc20Module {}
