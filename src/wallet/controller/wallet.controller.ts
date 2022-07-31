import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WalletPgRepository } from '../repositories/wallet-pg.repository';
import { WalletResponse } from './wallet.response';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppGuard } from '@app/application/guard/app.guard';

@Controller()
@ApiTags('Wallets')
export class WalletController {
  constructor(
    private readonly temporaryWalletPgRepository: WalletPgRepository,
  ) {}

  @Get('wallets')
  @ApiOkResponse({
    type: WalletResponse,
    isArray: true,
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  @ApiBearerAuth()
  public async list(): Promise<WalletResponse[]> {
    const wallets = await this.temporaryWalletPgRepository.findAll();

    return wallets.map((wallet) => new WalletResponse(wallet));
  }

  @Get('wallets/:address')
  @ApiOkResponse({
    type: WalletResponse,
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  @ApiBearerAuth()
  public async get(@Param('address') address: string): Promise<WalletResponse> {
    return new WalletResponse(
      await this.temporaryWalletPgRepository.getByAddress(address),
    );
  }
}
