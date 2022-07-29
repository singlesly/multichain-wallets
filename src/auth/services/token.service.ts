import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type Payload<T = Record<string, any>> = T & {
  readonly id: string;
  readonly address?: string;
  readonly login?: string;
};

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  public async generate(payload: Payload): Promise<string> {
    return this.jwt.sign({
      id: payload.id,
      login: payload.login,
      address: payload.address,
    });
  }

  public async verify(token: string): Promise<Payload> {
    return this.jwt.verify(token);
  }
}
