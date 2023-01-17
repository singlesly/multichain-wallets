import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { TokenService } from '@app/token/token.service';
import { Injectable } from '@nestjs/common';

export interface AuthResult {
  readonly token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authUserPgRepository: AuthUserPgRepository,
    private readonly jwtTokenService: TokenService,
  ) {}

  public async auth(login: string, password: string): Promise<AuthResult> {
    const user = await this.authUserPgRepository.getByLogin(login);
    user.verifyPassword(password);

    const token = await this.jwtTokenService.generate(user);

    return {
      token,
    };
  }
}
