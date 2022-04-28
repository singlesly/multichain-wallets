import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AgentServiceFactory } from '../factories/agent-service.factory';
import {
  ApiBasicAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Balance } from '../agent.service';
import { NetworkEnum } from '../../common/network.enum';
import { CoinEnum } from '../../common/coin.enum';
import { TransferWalletDto } from '../dto/transfer-wallet.dto';
import { WalletResponse } from './wallet.response';
import { AppGuard } from '../../application/guard/app.guard';

@Controller()
@ApiTags('Bridge')
export class BridgeController {
  constructor(private readonly agentServiceFactory: AgentServiceFactory) {}

  @Post(':network/:coin/wallet')
  @ApiParam({
    name: 'network',
    enum: NetworkEnum,
  })
  @ApiParam({
    name: 'coin',
    enum: CoinEnum,
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  public async createWallet(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
  ) {
    return new WalletResponse(
      await this.agentServiceFactory.for(network, coin).createWallet(),
    );
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
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  public async getBalance(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
    @Param('address') address: string,
  ): Promise<Balance> {
    return this.agentServiceFactory.for(network, coin).getBalance(address);
  }

  @Post(':network/:coin/transfer')
  @ApiParam({
    name: 'network',
    enum: NetworkEnum,
  })
  @ApiParam({
    name: 'coin',
    enum: CoinEnum,
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  public async transfer(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
    @Body() dto: TransferWalletDto,
  ): Promise<void> {
    const { from, to, amount } = dto;

    return this.agentServiceFactory
      .for(network, coin)
      .transfer(from, to, amount);
  }

  @Post(':network/:coin/estimate-fee')
  @ApiParam({
    name: 'network',
    enum: NetworkEnum,
  })
  @ApiParam({
    name: 'coin',
    enum: CoinEnum,
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  public async estimateFee(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
    @Body() { from, to, amount }: TransferWalletDto,
  ): Promise<Balance> {
    return this.agentServiceFactory
      .for(network, coin)
      .estimateFee(from, to, amount);
  }

  @Get('supported-coins')
  @ApiOkResponse({
    description: 'Key of object is network, value is symbol supported coins',
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  public async supportedCoins(): Promise<Record<string, string[]>> {
    const map = this.agentServiceFactory.supportedMap;

    return Object.entries(map).reduce((accum, [net, coin]) => {
      accum[net] = Object.keys(coin);
      return accum;
    }, {});
  }
}
