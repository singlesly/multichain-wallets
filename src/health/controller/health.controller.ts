import { Controller, Get } from '@nestjs/common';
import { HealthServiceResponse } from './health-service.response';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BitcoinRpcClient } from '../../bitcoin/rpc/bitcoin-rpc.client';
import { EthereumWeb3Service } from '../../ethereum/services/ethereum-web3.service';
import { LoggerService } from '@ledius/logger';
import { TronWeb3Service } from '../../tron/services/tron-web3.service';

@Controller()
@ApiTags('Health')
export class HealthController {
  constructor(
    private readonly bitcoinRpcClient: BitcoinRpcClient,
    private readonly ethereumWeb3Service: EthereumWeb3Service,
    private readonly tronWeb3Service: TronWeb3Service,
    private readonly logger: LoggerService,
  ) {}

  @Get('health')
  @ApiOkResponse({
    isArray: true,
    type: HealthServiceResponse,
  })
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
        available: await this.tronWeb3Service.eth
          .getBlockNumber()
          .then(() => true)
          .catch((err) => {
            this.logger.log({ err });
            return false;
          }),
      },
    ];
  }
}
