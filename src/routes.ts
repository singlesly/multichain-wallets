import { BridgeModule } from '@app/bridge/bridge.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { WalletBalanceModule } from '@app/wallet-balance/wallet-balance.module';
import { ConverterModule } from '@app/converter/converter.module';

const modules = [
  ConverterModule,
  NetworkModule,
  TokenModule,
  WalletBalanceModule,
  BridgeModule,
  WalletModule,
];

export const routes = [...modules.map((module) => ({ path: '/api', module }))];
