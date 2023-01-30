import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { REQUEST_META_KEY, RequestMeta } from '@app/auth/contants';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

type TokenType = 'bearer' | 'basic';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly token: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    if (!authorization) {
      return false;
    }

    const tokenType: TokenType = authorization
      .split(' ')[0]
      .toLowerCase() as TokenType;
    const encodedAuth = authorization.split(' ')[1] as `${string}`;

    if (tokenType === 'bearer') {
      return await this.handleBearer(encodedAuth, context);
    }

    return false;
  }
  private async handleBearer(
    token: string,
    context: ExecutionContext,
  ): Promise<boolean> {
    const payload = await this.token.verify<RequestMeta>(token);
    this.setAuthPayload(context, {
      userId: payload.userId,
      ownerId: payload.ownerId,
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
