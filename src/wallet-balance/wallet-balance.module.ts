import { Module } from '@nestjs/common';
import { BridgeModule } from '@app/bridge/bridge.module';
import { WalletModule } from '@app/wallet/wallet.module';
import { TokenModule } from '@app/token/token.module';
import { NetworkModule } from '@app/network/network.module';
import { WalletBalanceController } from '@app/wallet-balance/controllers/wallet-balance.controller';
import { WalletBalanceService } from '@app/wallet-balance/services/wallet-balance.service';

@Module({
  imports: [BridgeModule, WalletModule, TokenModule, NetworkModule],
  controllers: [WalletBalanceController],
  providers: [WalletBalanceService],
})
export class WalletBalanceModule {}
