import { Controller, Get, Param } from '@nestjs/common';
import { TemporaryWalletPgRepository } from '../repositories/temporary-wallet-pg.repository';
import { WalletResponse } from './wallet.response';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Wallets')
export class WalletController {
  constructor(
    private readonly temporaryWalletPgRepository: TemporaryWalletPgRepository,
  ) {}

  @Get('wallets')
  @ApiOkResponse({
    type: WalletResponse,
    isArray: true,
  })
  public async list(): Promise<WalletResponse[]> {
    const wallets = await this.temporaryWalletPgRepository.findAll();

    return wallets.map((wallet) => new WalletResponse(wallet));
  }

  @Get('wallets/:address')
  @ApiOkResponse({
    type: WalletResponse,
  })
  public async get(@Param('address') address: string): Promise<WalletResponse> {
    return new WalletResponse(
      await this.temporaryWalletPgRepository.getByAddress(address),
    );
  }
}
