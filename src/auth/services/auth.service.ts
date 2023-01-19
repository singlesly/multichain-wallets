import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

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
    if (!user) {
      throw new BaseException({
        statusCode: WebErrorsEnum.NOT_FOUND,
        message: 'User not found',
      });
    }
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
