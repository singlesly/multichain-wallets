import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FeatureService } from '@app/feature/services/feature.service';
import { Reflector } from '@nestjs/core';
import { FEATURES_KEY } from '@app/feature/decorators/features';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private readonly featureService: FeatureService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextHandler = context.getHandler();

    const features =
      this.reflector.get<string[]>(FEATURES_KEY, contextHandler) || [];

    const featurePass = features.every((feature) =>
      this.featureService.isOn(feature),
    );

    if (!featurePass) {
      throw new BaseException({
        statusCode: WebErrorsEnum.PERMISSION_DENIED,
        message: 'Resource unavailable',
      });
    }

    return true;
  }
}
