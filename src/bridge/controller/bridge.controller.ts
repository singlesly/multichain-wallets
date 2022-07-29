import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AgentServiceFactory } from '../factories/agent-service.factory';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Balance, TransactionInfo } from '@app/bridge/services/agent.service';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { TransferWalletDto } from '@app/wallet/dto/transfer-wallet.dto';
import { WalletResponse } from '@app/wallet/controller/wallet.response';
import { AppGuard } from '@app/application/guard/app.guard';
import { TransactionResponse } from '@app/bridge/controller/transaction.response';
import { RequestPayload } from '@app/auth/decorators/request-payload';
import { RequestMeta } from '@app/auth/contants';

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
  @ApiBearerAuth()
  public async createWallet(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
    @RequestPayload() meta: RequestMeta,
  ) {
    return new WalletResponse(
      await this.agentServiceFactory
        .for(network, coin)
        .createWallet([meta.ownerId]),
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiOkResponse({
    type: TransactionResponse,
  })
  public async transfer(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
    @Body() dto: TransferWalletDto,
  ): Promise<TransactionResponse> {
    const { from, to, amount } = dto;

    return new TransactionResponse(
      await this.agentServiceFactory
        .for(network, coin)
        .transfer(from, to, amount),
    );
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
  @ApiBearerAuth()
  public async estimateFee(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
    @Body() { from, to, amount }: TransferWalletDto,
  ): Promise<Balance> {
    return this.agentServiceFactory
      .for(network, coin)
      .estimateFee(from, to, amount);
  }

  @Get(':network/:coin/transaction/:transactionId')
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
  @ApiBearerAuth()
  public async getTransaction(
    @Param('network') network: NetworkEnum,
    @Param('coin') coin: CoinEnum,
    @Param('transactionId') transactionId: string,
  ): Promise<TransactionInfo> {
    return this.agentServiceFactory
      .for(network, coin)
      .getTransaction(transactionId);
  }

  @Get('supported-coins')
  @ApiOkResponse({
    description: 'Key of object is network, value is symbol supported coins',
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  @ApiBearerAuth()
  public async supportedCoins(): Promise<Record<string, string[]>> {
    const map = this.agentServiceFactory.supportedMap;

    return Object.entries(map).reduce((accum, [net, coin]) => {
      accum[net] = Object.keys(coin);
      return accum;
    }, {});
  }
}
