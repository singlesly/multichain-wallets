import { Body, Controller, Post } from '@nestjs/common';
import { TemporaryWalletServiceFactory } from '../factories/temporary-wallet-service.factory';
import { CreateTemporaryWalletDto } from '../dto/create-temporary-wallet.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Temporary Wallet')
export class TemporaryWalletController {
  constructor(
    private readonly temporaryWalletServiceFactory: TemporaryWalletServiceFactory,
  ) {}

  @Post('wallet')
  public async createWallet(@Body() dto: CreateTemporaryWalletDto) {
    return this.temporaryWalletServiceFactory
      .for(dto.network, dto.coin)
      .createWallet();
  }
}
