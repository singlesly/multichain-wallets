import { Controller, Get } from '@nestjs/common';
import { HealthServiceResponse } from './health-service.response';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BitcoinRpcClient } from '../../bitcoin/rpc/bitcoin-rpc.client';

@Controller()
@ApiTags('Health')
export class HealthController {
  constructor(private readonly bitcoinRpcClient: BitcoinRpcClient) {}

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
    ];
  }
}
