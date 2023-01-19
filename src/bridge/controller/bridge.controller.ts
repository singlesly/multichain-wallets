import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AgentServiceFactory } from '../factories/agent-service.factory';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Balance,
  TransactionInfo,
} from '@app/bridge/interfaces/agent-service.interface';
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

  @Post(':network/:symbol/wallet')
  @ApiParam({
    name: 'network',
    example: 'nile',
  })
  @ApiParam({
    name: 'symbol',
    example: 'usdt',
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  @ApiBearerAuth()
  public async createWallet(
    @Param('network') network: string,
    @Param('symbol') symbol: string,
    @RequestPayload() meta: RequestMeta,
  ) {
    return new WalletResponse(
      await this.agentServiceFactory
        .for(network, symbol)
        .then((agent) => agent.createWallet([meta.ownerId])),
    );
  }

  @Get(':network/:symbol/wallet/:address/balance')
  @ApiParam({
    name: 'network',
    example: 'nile',
  })
  @ApiParam({
    name: 'symbol',
    example: 'usdt',
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  @ApiBearerAuth()
  public async getBalance(
    @Param('network') network: string,
    @Param('symbol') coin: string,
    @Param('address') address: string,
  ): Promise<Balance> {
    return this.agentServiceFactory
      .for(network, coin)
      .then((agent) => agent.getBalance(address));
  }

  @Post(':network/:symbol/transfer')
  @ApiParam({
    name: 'network',
    example: 'nile',
  })
  @ApiParam({
    name: 'symbol',
    example: 'usdt',
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: TransactionResponse,
  })
  public async transfer(
    @Param('network') network: string,
    @Param('symbol') coin: string,
    @Body() dto: TransferWalletDto,
    @RequestPayload() meta: RequestMeta,
  ): Promise<TransactionResponse> {
    const { from, to, amount } = dto;

    return new TransactionResponse(
      await this.agentServiceFactory.for(network, coin).then((agent) =>
        agent.transfer(from, to, amount, {
          initiator: meta.ownerId,
        }),
      ),
    );
  }

  @Post(':network/:symbol/estimate-fee')
  @ApiParam({
    name: 'network',
    example: 'nile',
  })
  @ApiParam({
    name: 'symbol',
    example: 'usdt',
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  @ApiBearerAuth()
  public async estimateFee(
    @Param('network') network: NetworkEnum,
    @Param('symbol') coin: CoinEnum,
    @Body() { from, to, amount }: TransferWalletDto,
  ): Promise<Balance> {
    return this.agentServiceFactory
      .for(network, coin)
      .then((agent) => agent.estimateFee(from, to, amount));
  }

  @Get(':network/:symbol/transaction/:transactionId')
  @ApiParam({
    name: 'network',
    example: 'nile',
  })
  @ApiParam({
    name: 'symbol',
    example: 'usdt',
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  @ApiBearerAuth()
  public async getTransaction(
    @Param('network') network: NetworkEnum,
    @Param('symbol') coin: CoinEnum,
    @Param('transactionId') transactionId: string,
  ): Promise<TransactionInfo> {
    return this.agentServiceFactory
      .for(network, coin)
      .then((agent) => agent.getTransaction(transactionId));
  }
}
