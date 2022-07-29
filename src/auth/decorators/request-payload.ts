import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_META_KEY, RequestMeta } from '@app/auth/contants';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

export const RequestPayload = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const meta: RequestMeta | undefined = Reflect.get(
      request,
      REQUEST_META_KEY,
    );

    if (!meta) {
      throw new BaseException({
        message: 'Meta not defined',
        statusCode: WebErrorsEnum.INTERNAL_ERROR,
      });
    }

    return meta;
  },
);
