import { Injectable } from '@nestjs/common';
import { LocalEnvPathEnum } from '../contants/local-env-path.enum';
import { EnvProviderService } from '@ledius/env';

@Injectable()
export class LocalEnvService {
  constructor(private readonly envProviderService: EnvProviderService) {}

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
}
