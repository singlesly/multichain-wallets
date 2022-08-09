import { DynamicModule, Module } from '@nestjs/common';
import { EnvModule } from '@app/env/env.module';
import { FeatureService } from '@app/feature/services/feature.service';
import { FeatureProvider } from '@app/feature/interfaces/feature-provider';
import { Features } from '@app/feature/interfaces/features';
import { FEATURE_PROVIDER } from '@app/feature/contants';
import { LoggerModule, LoggerService } from '@ledius/logger';
import { FeatureModuleOptions } from '@app/feature/interfaces/feature-module.options';
import { EnvFeatureProvider } from '@app/feature/providers/env-feature-provider';

@Module({})
export class FeatureModule {
  public static forRoot(options: FeatureModuleOptions = {}): DynamicModule {
    const provider = options.provider ?? EnvFeatureProvider;

    return {
      global: true,
      module: FeatureModule,
      imports: [EnvModule, LoggerModule],
      providers: [
        {
          provide: FEATURE_PROVIDER,
          useClass: provider,
        },
        {
          provide: FeatureService,
          useFactory: async (
            featureProvider: FeatureProvider,
            loggerService: LoggerService,
          ) => {
            loggerService.log('Initialize features');

            const featureList = await featureProvider.getFeatures();
            const features = featureList.reduce(
              (features, feature) => features.apply(feature),
              new Features(),
            );

            features
              .getFeatures()
              .forEach((feature) => loggerService.log(feature));

            return new FeatureService(features);
          },
          inject: [FEATURE_PROVIDER, LoggerService],
        },
      ],
      exports: [FeatureService],
    };
  }
}
