import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface AuthResult {
  readonly token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authUserPgRepository: AuthUserPgRepository,
    private readonly jwtTokenService: JwtService,
  ) {}

  public async auth(login: string, password: string): Promise<AuthResult> {
    const user = await this.authUserPgRepository.getByLogin(login);
    user.verifyPassword(password);

    const token = await this.jwtTokenService.signAsync({
      ownerId: user.id,
      userId: user.id,
    });

    return {
      token,
    };
  }
}
