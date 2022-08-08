import { DynamicModule, Module, Type } from '@nestjs/common';
import { EnvModule } from '@app/env/env.module';
import { FeatureService } from '@app/feature/services/feature.service';
import { FeatureProvider } from '@app/feature/interfaces/feature-provider';
import { Features } from '@app/feature/interfaces/features';
import { EnvFeatureProvider } from '@app/feature/providers/env-feature-provider';
import { FEATURE_PROVIDER } from '@app/feature/contants';

@Module({})
export class FeatureModule {
  public static forRoot(
    provider: Type<any> = EnvFeatureProvider,
  ): DynamicModule {
    return {
      global: true,
      module: FeatureModule,
      imports: [EnvModule],
      providers: [
        {
          provide: FEATURE_PROVIDER,
          useClass: provider,
        },
        {
          provide: FeatureService,
          useFactory: async (featureProvider: FeatureProvider) => {
            const featureList = await featureProvider.getFeatures();
            const features = featureList.reduce(
              (features, feature) => features.apply(feature),
              new Features(),
            );

            return new FeatureService(features);
          },
          inject: [FEATURE_PROVIDER],
        },
      ],
    };
  }
}
