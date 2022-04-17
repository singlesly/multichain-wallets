import { Controller, Get, Param, Post } from '@nestjs/common';
import { TemporaryWalletServiceFactory } from '../factories/temporary-wallet-service.factory';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Balance } from '../temporary-wallet.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';

@Controller()
@ApiTags('Bridge')
export class BridgeController {
  constructor(
    private readonly temporaryWalletServiceFactory: TemporaryWalletServiceFactory,
  ) {}

  @Post(':network/:coin/wallet')
  @ApiParam({
    name: 'network',
    enum: NetworkEnum,
  })
  @ApiParam({
    name: 'coin',
    enum: CoinEnum,
  })
  public async createWallet(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
  ) {
    return this.temporaryWalletServiceFactory.for(network, coin).createWallet();
  }

  @Get(':network/:coin/wallet/:address/balance')
  @ApiParam({
    name: 'network',
    enum: NetworkEnum,
  })
  @ApiParam({
    name: 'coin',
    enum: CoinEnum,
  })
  public async getBalance(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
    @Param('address') address: string,
  ): Promise<Balance> {
    return this.temporaryWalletServiceFactory
      .for(network, coin)
      .getBalance(address);
  }

  @Get('supported-coins')
  @ApiOkResponse({
    description: 'Key of object is network, value is symbol supported coins',
  })
  public async supportedCoins(): Promise<Record<string, string[]>> {
    const map = this.temporaryWalletServiceFactory.supportedMap;

    return Object.entries(map).reduce((accum, [net, coin]) => {
      accum[net] = Object.keys(coin);
      return accum;
    }, {});
  }
}
