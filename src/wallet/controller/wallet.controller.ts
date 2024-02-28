import { Controller, Get, Param, Query } from '@nestjs/common';
import { WalletPgRepository } from '../repositories/wallet-pg.repository';
import { WalletResponse } from './wallet.response';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { WalletsListDto } from '@app/wallet/dto/wallets-list.dto';

@Controller()
@ApiTags('Wallets')
export class WalletController {
  constructor(private readonly walletPgRepository: WalletPgRepository) {}

  @Get('wallets')
  @ApiOkResponse({
    type: WalletResponse,
    isArray: true,
  })
  public async list(@Query() dto: WalletsListDto): Promise<WalletResponse[]> {
    const wallets = await this.walletPgRepository.findBy({
      owners: dto.owners,
    });

    return wallets.map((wallet) => new WalletResponse(wallet));
  }

  @Get('wallets/:address')
  @ApiOkResponse({
    type: WalletResponse,
  })
  public async get(@Param('address') address: string): Promise<WalletResponse> {
    return new WalletResponse(
      await this.walletPgRepository.getByAddress(address),
    );
  }
}
