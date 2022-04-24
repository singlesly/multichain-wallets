import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Application } from '../dao/entity/application';

@Injectable()
export class AppGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const encodedAuth = request.headers.authorization.split(' ')[1];
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
