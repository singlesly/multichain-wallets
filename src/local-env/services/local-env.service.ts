import { Injectable } from '@nestjs/common';
import { LocalEnvPathEnum } from '../contants/local-env-path.enum';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { EnvProviderService } from '@ledius/env';

@Injectable()
export class LocalEnvService {
  constructor(private readonly envProviderService: EnvProviderService) {}

  public getAdminAddresses(): string[] {
    const admins = this.envProviderService.get(
      LocalEnvPathEnum.ADMIN_ADDRESSES,
    );

    if (!admins) {
      return [];
    }

    return admins
      .split(',')
      .map((str) => str.toLowerCase())
      .filter((item) => item.length > 0);
  }

  public get(key: LocalEnvPathEnum): string | undefined {
    return this.envProviderService.get(key);
  }

  public getSafety(key: LocalEnvPathEnum): string {
    return this.envProviderService.getOrFail(key);
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
}
