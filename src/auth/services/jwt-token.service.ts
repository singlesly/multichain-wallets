import { NotImplementedException } from '@nestjs/common';

export type Payload<T = {}> = T & {
  readonly id: string;
  readonly address?: string;
  readonly login?: string;
};

export class JwtTokenService {
  public async generate(payload: Payload): Promise<string> {
    throw new NotImplementedException();
  }
}
