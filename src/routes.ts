import { BridgeModule } from '@app/bridge/bridge.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { AuthModule } from '@app/auth/auth.module';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { ApplicationModule } from '@app/application/application.module';
import { WalletBalanceModule } from '@app/wallet-balance/wallet-balance.module';
import { PaymentModule } from '@app/payment/payment.module';
import { ConverterModule } from '@app/converter/converter.module';

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
  {
    path: '/api',
    module: NetworkModule,
  },
  {
    path: '/api',
    module: PaymentModule,
  },
  {
    path: '/api',
    module: TokenModule,
  },
  {
    path: '/api',
    module: ApplicationModule,
  },
  {
    path: '/api',
    module: WalletBalanceModule,
  },
  {
    path: '/api',
    module: ConverterModule,
  },
];
