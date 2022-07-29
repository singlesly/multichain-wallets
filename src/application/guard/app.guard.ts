import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Application } from '../dao/entity/application';
import { TokenService } from '@app/auth/services/token.service';

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
      return await this.handleBasic(encodedAuth);
    }
    if (tokenType === 'bearer') {
      return await this.handleBearer(encodedAuth);
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

  private async handleBearer(token: string): Promise<boolean> {
    await this.token.verify(token);

    return true;
  }
}
