import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WalletBalanceService } from '@app/wallet-balance/services/wallet-balance.service';
import { WalletsListDto } from '@app/wallet/dto/wallets-list.dto';
import { WalletWithBalancesResponse } from '@app/wallet-balance/controllers/wallet-with-balances.response';
import { AuthGuard } from '@app/auth/guards/auth.guard';

@Controller()
@ApiTags('Wallet Balances')
export class WalletBalanceController {
  constructor(private readonly walletBalanceService: WalletBalanceService) {}
  @Get('wallet-balances')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async getWalletsWithBalances(
    @Query() dto: WalletsListDto,
  ): Promise<WalletWithBalancesResponse[]> {
    const wallets = await this.walletBalanceService.getWalletsWithBalances(
      dto.owners,
    );
    return wallets.map((wallet) => new WalletWithBalancesResponse(wallet));
  }
}
