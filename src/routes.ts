import { BridgeModule } from '@app/bridge/bridge.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { AuthModule } from '@app/auth/auth.module';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { ApplicationModule } from '@app/application/application.module';
import { WalletBalanceModule } from '@app/wallet-balance/wallet-balance.module';
import { PaymentModule } from '@app/payment/payment.module';
import { ConverterModule } from '@app/converter/converter.module';
import { OfferModule } from '@app/offer/offer.module';

const modules = [
  ApplicationModule,
  ConverterModule,
  NetworkModule,
  OfferModule,
  PaymentModule,
  TokenModule,
  WalletBalanceModule,
];

export const routes = [
  {
    path: '/api/bridge',
    module: BridgeModule,
  },
  {
    path: '/api/bridge',
    module: WalletModule,
  },
  {
    path: '/api/auth',
    module: AuthModule,
  },
  ...modules.map((module) => ({ path: '/api', module })),
];
