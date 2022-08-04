import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

export class AuthUser {
  public readonly id: string;
  public readonly login?: string;
  public readonly password?: string;
  public address?: string;
  public readonly createdAt: string;

  public static createByAddress(address: string) {
    const authUser = new AuthUser();
    authUser.address = address;
    return authUser;
  }

  public verifyPassword(password: string): void {
    if (password !== this.password || !this.password) {
      throw new BaseException({
        message: 'Unauthorized',
        statusCode: WebErrorsEnum.UNAUTHORIZED,
      });
    }
  }
}
