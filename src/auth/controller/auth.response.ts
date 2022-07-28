import { AuthResult } from '@app/auth/services/auth.service';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty()
  public readonly token: string;

  constructor(auth: AuthResult) {
    this.token = auth.token;
  }
}
