import { ApiProperty } from '@nestjs/swagger';
import { AuthResult } from '@app/auth/services/web3-auth.service';

export class AuthResponse {
  @ApiProperty()
  public readonly token: string;

  constructor(auth: AuthResult) {
    this.token = auth.token;
  }
}
