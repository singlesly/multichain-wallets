import { TemporaryWalletModule } from './temporary-wallet/temporary-wallet.module';
import { HealthModule } from './health/health.module';

export const routes = [
  {
    path: '/api/bridge',
    module: TemporaryWalletModule,
  },
  {
    path: '/api/bridge/health',
    module: HealthModule,
  },
];
