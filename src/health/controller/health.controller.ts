import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { HealthServiceResponse } from './health-service.response';
import { ApiBasicAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BitcoinRpcClient } from '../../bitcoin/rpc/bitcoin-rpc.client';
import { EthereumWeb3Service } from '../../ethereum/services/ethereum-web3.service';
import { LoggerService } from '@ledius/logger';
import { TronClientService } from '../../tron/services/tron-client.service';
import { AppGuard } from '../../application/guard/app.guard';

@Controller()
@ApiTags('Health')
export class HealthController {
  constructor(
    private readonly bitcoinRpcClient: BitcoinRpcClient,
    private readonly ethereumWeb3Service: EthereumWeb3Service,
    private readonly tronClientService: TronClientService,
    private readonly logger: LoggerService,
  ) {}

  @Get('health')
  @ApiOkResponse({
    isArray: true,
    type: HealthServiceResponse,
  })
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  @Header('WWW-Authenticate', 'basic')
  public async getServices(): Promise<HealthServiceResponse[]> {
    return [
      {
        serviceName: 'Bitcoin Node',
        available: await this.bitcoinRpcClient
          .uptime()
          .then(() => true)
          .catch(() => false),
      },
      {
        serviceName: 'Ethereum Network',
        available: await this.ethereumWeb3Service.eth
          .getBlockNumber()
          .then(() => true)
          .catch((err) => {
            this.logger.log({ err });
            return false;
          }),
      },
      {
        serviceName: 'Tron Network',
        available: await this.tronClientService
          .getNowBlock()
          .then(() => true)
          .catch((err) => {
            this.logger.log({ err });
            return false;
          }),
      },
    ];
  }
}
