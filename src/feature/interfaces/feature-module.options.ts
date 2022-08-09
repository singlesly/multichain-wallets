import { FeatureProvider } from '@app/feature/interfaces/feature-provider';
import { Type } from '@nestjs/common';

export interface FeatureModuleOptions {
  readonly provider?: Type<FeatureProvider>;
}
