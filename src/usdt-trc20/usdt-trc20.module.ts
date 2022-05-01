import { Module } from '@nestjs/common';
import { TronModule } from '@app/tron/tron.module';
import {
  USDT_CONTRACT_ADDRESS,
  USDT_CONTRACT,
} from '@app/usdt-trc20/constants';
import TronWeb, { TRC20Contract } from 'tronweb';

@Module({
  imports: [TronModule],
  providers: [
    {
      provide: USDT_CONTRACT,
      useFactory: async (tronWeb: TronWeb): Promise<TRC20Contract> => {
        return await tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
      },
      inject: [TronWeb],
    },
  ],
})
export class UsdtTrc20Module {}
