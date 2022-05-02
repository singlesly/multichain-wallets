import { Module } from '@nestjs/common';
import { TronModule } from '@app/tron/tron.module';
import {
  USDT_CONTRACT_ADDRESS,
  USDT_CONTRACT,
} from '@app/usdt-trc20/constants';
import TronWeb, { TRC20Contract } from 'tronweb';
import { USDTClientService } from '@app/usdt-trc20/services/usdt-client.service';

@Module({
  imports: [TronModule],
  providers: [
    USDTClientService,
    {
      provide: USDT_CONTRACT,
      useFactory: async (tronWeb: TronWeb): Promise<TRC20Contract> => {
        return tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
      },
      inject: [TronWeb],
    },
  ],
  exports: [USDTClientService],
})
export class UsdtTrc20Module {}
