import { EnvProviderService } from './env-provider.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalEnvService {
  constructor(private readonly envProvider: EnvProviderService) {}
}
