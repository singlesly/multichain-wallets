import { Injectable } from '@nestjs/common';
import {
  Feature,
  FeatureProvider,
} from '@app/feature/interfaces/feature-provider';
import { EnvProviderService } from '@app/env/services/env-provider.service';
import { ENV_FEATURE_PREFIX } from '@app/feature/contants';

@Injectable()
export class EnvFeatureProvider implements FeatureProvider {
  constructor(private readonly envProviderService: EnvProviderService) {}

  public async getFeatures(): Promise<Feature[]> {
    const envs = this.envProviderService.getAll();

    const featureEnvs = Object.entries(envs).filter(([feature]) =>
      feature.startsWith(ENV_FEATURE_PREFIX),
    );

    return featureEnvs.map(([feature, value]) => {
      return {
        key: feature,
        enabled: value === '1',
      };
    });
  }
}
