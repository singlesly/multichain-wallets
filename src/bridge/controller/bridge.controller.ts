import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AgentServiceFactory } from '../factories/agent-service.factory';
import { ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  Balance,
  TransactionInfo,
} from '@app/bridge/interfaces/agent-service.interface';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';
import { TransferWalletDto } from '@app/wallet/dto/transfer-wallet.dto';
import { WalletResponse } from '@app/wallet/controller/wallet.response';
import { TransactionResponse } from '@app/bridge/controller/transaction.response';
import { BalanceResponse } from '@app/bridge/controller/balance.response';
import { ContractCallDto } from '@app/bridge/dto/contract-call.dto';

@Controller('bridge')
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
  public async createWallet(
    @Param('network') network: string,
    @Param('symbol') symbol: string,
  ) {
    return new WalletResponse(
      await this.agentServiceFactory
        .for(network.toLowerCase(), symbol.toLowerCase())
        .then((agent) => agent.createWallet([])),
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
  public async getBalance(
    @Param('network') network: string,
    @Param('symbol') coin: string,
    @Param('address') address: string,
  ): Promise<BalanceResponse> {
    return this.agentServiceFactory
      .for(network.toLowerCase(), coin.toLowerCase())
      .then((agent) => agent.getBalance(address))
      .then((balance) => new BalanceResponse(balance));
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
  @ApiOkResponse({
    type: TransactionResponse,
  })
  public async transfer(
    @Param('network') network: string,
    @Param('symbol') symbol: string,
    @Body() dto: TransferWalletDto,
  ): Promise<TransactionResponse> {
    const { from, to, amount } = dto;

    return new TransactionResponse(
      await this.agentServiceFactory
        .for(network.toLowerCase(), symbol.toLowerCase())
        .then((agent) => agent.transfer(from, to, amount)),
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
  public async estimateFee(
    @Param('network') network: NetworkEnum,
    @Param('symbol') symbol: CoinEnum,
    @Body() { from, to, amount }: TransferWalletDto,
  ): Promise<Balance> {
    return this.agentServiceFactory
      .for(network.toLowerCase(), symbol.toLowerCase())
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
  public async getTransaction(
    @Param('network') network: NetworkEnum,
    @Param('symbol') symbol: CoinEnum,
    @Param('transactionId') transactionId: string,
  ): Promise<TransactionInfo> {
    return this.agentServiceFactory
      .for(network.toLowerCase(), symbol.toLowerCase())
      .then((agent) => agent.getTransaction(transactionId));
  }

  @Post(':network/:symbol/contract/:method/call')
  @ApiParam({
    name: 'network',
    example: 'shar',
  })
  @ApiParam({
    name: 'symbol',
    example: 'rub',
  })
  @ApiParam({
    name: 'method',
    example: 'balanceOf',
  })
  public async contractCall(
    @Param('network') network: NetworkEnum,
    @Param('symbol') symbol: CoinEnum,
    @Param('method') method: string,
    @Body() dto: ContractCallDto,
  ) {
    const result = await this.agentServiceFactory
      .for(network.toLowerCase(), symbol.toLowerCase())
      .then((agent) => agent.request(dto.from, 'call', method, ...dto.params));

    return { result };
  }

  @Post(':network/:symbol/contract/:method/send')
  @ApiParam({
    name: 'network',
    example: 'shar',
  })
  @ApiParam({
    name: 'symbol',
    example: 'rub',
  })
  @ApiParam({
    name: 'method',
    example: 'transfer',
  })
  public async contractSend(
    @Param('network') network: NetworkEnum,
    @Param('symbol') symbol: CoinEnum,
    @Param('method') method: string,
    @Body() dto: ContractCallDto,
  ) {
    const result = await this.agentServiceFactory
      .for(network.toLowerCase(), symbol.toLowerCase())
      .then((agent) => agent.request(dto.from, 'send', method, ...dto.params));

    return { result };
  }
}
