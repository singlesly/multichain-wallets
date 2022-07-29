import { EnvProviderService } from './env-provider.service';
import { Injectable } from '@nestjs/common';
import { LocalEnvPathEnum } from '../contants/local-env-path.enum';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

@Injectable()
export class LocalEnvService {
  constructor(private readonly envProvider: EnvProviderService) {}

  public getSafety(key: LocalEnvPathEnum): string {
    return this.envProvider.getSafety(key);
  }

  public getBoolean(key: LocalEnvPathEnum): boolean {
    const v = this.getSafety(key);
    return v === '1' || v === 'true';
  }

  public getJwtOptions(): JwtModuleOptions {
    return {
      secret: this.getSafety(LocalEnvPathEnum.JWT_SECRET),
    };
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
