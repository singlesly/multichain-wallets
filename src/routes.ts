import { BridgeModule } from '@app/bridge/bridge.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { AuthModule } from '@app/auth/auth.module';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { ApplicationModule } from '@app/application/application.module';
import { WalletBalanceModule } from '@app/wallet-balance/wallet-balance.module';

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
];
