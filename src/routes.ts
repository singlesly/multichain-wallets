import { BridgeModule } from '@app/bridge/bridge.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { AuthModule } from '@app/auth/auth.module';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { PaymentModule } from '@app/payment/payment.module';

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
];
