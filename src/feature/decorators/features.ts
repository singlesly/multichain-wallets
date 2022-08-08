import { SetMetadata } from '@nestjs/common';

export const FEATURES_KEY = 'FEATURES_KEY';

export const UseFeatures = (...features: string[]) =>
  SetMetadata(FEATURES_KEY, features);
