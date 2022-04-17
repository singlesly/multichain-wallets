import { EnvProviderService } from './env-provider.service';
import { Injectable } from '@nestjs/common';
import { LocalEnvPathEnum } from '../contants/local-env-path.enum';

@Injectable()
export class LocalEnvService {
  constructor(private readonly envProvider: EnvProviderService) {}

  public getSafety(key: LocalEnvPathEnum): string {
    return this.envProvider.getSafety(key);
  }
}
