import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Application } from '../dao/entity/application';

type TokenType = 'bearer' | 'basic';

@Injectable()
export class AppGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    if (!authorization) {
      return false;
    }

    const tokenType: TokenType = authorization.split(' ')[0] as TokenType;
    const encodedAuth = authorization.split(' ')[1] as `${string}:${string}`;

    if (tokenType === 'basic') {
      return await this.handleBasic(encodedAuth);
    }

    return false;
  }

  private async handleBasic(
    encodedAuth: `${string}:${string}`,
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

    return app.authId() === appId;
  }
}
