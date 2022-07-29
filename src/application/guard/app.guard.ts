import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Application } from '../dao/entity/application';
import { TokenService } from '@app/token/token.service';
import { REQUEST_META_KEY, RequestMeta } from '@app/auth/contants';

type TokenType = 'bearer' | 'basic';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private readonly token: TokenService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    if (!authorization) {
      return false;
    }

    const tokenType: TokenType = authorization
      .split(' ')[0]
      .toLowerCase() as TokenType;
    const encodedAuth = authorization.split(' ')[1] as `${string}:${string}`;

    if (tokenType === 'basic') {
      return await this.handleBasic(encodedAuth, context);
    }
    if (tokenType === 'bearer') {
      return await this.handleBearer(encodedAuth, context);
    }

    return false;
  }

  private async handleBasic(
    encodedAuth: `${string}:${string}`,
    context: ExecutionContext,
  ): Promise<boolean> {
    if (!encodedAuth) {
      return false;
    }
    const decodedAuth = Buffer.from(encodedAuth, 'base64').toString('utf8');
    const [appId, secret] = decodedAuth.split(':');
    const app = await Application.findOne({
      where: {
        secret,
      },
    });

    if (!app) {
      return false;
    }

    if (app.authId() === appId) {
      this.setAuthPayload(context, {
        appId: app.id,
      });
      return true;
    }

    return false;
  }

  private async handleBearer(
    token: string,
    context: ExecutionContext,
  ): Promise<boolean> {
    const payload = await this.token.verify(token);
    this.setAuthPayload(context, {
      userId: payload.id,
    });

    return true;
  }

  private setAuthPayload(context: ExecutionContext, meta: RequestMeta): void {
    const request = context.switchToHttp().getRequest<Request>();
    Reflect.defineProperty(request, REQUEST_META_KEY, {
      value: meta,
    });
  }
}
