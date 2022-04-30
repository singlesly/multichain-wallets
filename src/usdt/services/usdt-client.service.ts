import { Injectable } from '@nestjs/common';
import { ParameterService } from '@app/tron/services/parameter.service';
import { TronClientService } from '@app/tron/services/tron-client.service';

@Injectable()
export class USDTClientService {
  constructor(
    private readonly parameterService: ParameterService,
    private readonly tronClientService: TronClientService,
  ) {}
}
