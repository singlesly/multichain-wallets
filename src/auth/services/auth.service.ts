import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { JwtTokenService } from '@app/auth/services/jwt-token.service';

export interface AuthResult {
  readonly token: string;
}

export class AuthService {
  constructor(
    private readonly authUserPgRepository: AuthUserPgRepository,
    private readonly jwtTokenService: JwtTokenService,
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
