import { EnvProviderService } from './env-provider.service';
import { Injectable } from '@nestjs/common';
import { LocalEnvPathEnum } from '../contants/local-env-path.enum';

@Injectable()
export class LocalEnvService {
  constructor(private readonly envProvider: EnvProviderService) {}

  public getSafety(key: LocalEnvPathEnum): string {
    return this.envProvider.getSafety(key);
  }

  public getUsdtContractAddress(): string {
    const fromEnvsAddress = this.envProvider.get(
      LocalEnvPathEnum.USDT_CONTRACT_ADDRESS,
    );

    if (fromEnvsAddress) {
      return fromEnvsAddress;
    }

    const networkAddressMap = {
      'nile.trongrid.io': 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
    };

    const tronNetworkUrl = new URL(
      this.envProvider.getSafety(LocalEnvPathEnum.TRON_RPC_BASE_URL),
    );
    const mapAddress = networkAddressMap[tronNetworkUrl.host];

    if (mapAddress) {
      return mapAddress;
    }

    // Production tron address
    return 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
  }
}
