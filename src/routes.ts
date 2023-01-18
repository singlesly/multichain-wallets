import { HealthModule } from './health/health.module';
import { BridgeModule } from '@app/bridge/bridge.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { AuthModule } from '@app/auth/auth.module';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';

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
    path: '/api/bridge/health',
    module: HealthModule,
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
];
