import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  WalletBalanceService,
  WalletWithBalances,
} from '@app/wallet-balance/services/wallet-balance.service';
import { WalletsListDto } from '@app/wallet/dto/wallets-list.dto';
import { WalletWithBalancesResponse } from '@app/wallet-balance/controllers/wallet-with-balances.response';

@Controller()
@ApiTags('Wallet Balances')
export class WalletBalanceController {
  constructor(private readonly walletBalanceService: WalletBalanceService) {}
  z;

  @Get('wallet-balances')
  public async getWalletsWithBalances(
    @Query() dto: WalletsListDto,
  ): Promise<WalletWithBalancesResponse[]> {
    const wallets = await this.walletBalanceService.getWalletsWithBalances(
      dto.owners,
    );
    return wallets.map((wallet) => new WalletWithBalancesResponse(wallet));
  }
}
