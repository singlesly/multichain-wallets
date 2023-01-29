import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

const TABLE_NAME = 'auth_users';

@Entity(TABLE_NAME)
export class AuthUser {
  @PrimaryColumn({
    type: 'uuid',
  })
  public readonly id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public login?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public password?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  public address?: string;

  @CreateDateColumn()
  public readonly createdAt!: string;

  constructor() {
    this.id = v4();
  }

  public static createByLogin(login: string, password: string) {
    const self = new AuthUser();
    self.login = login;
    self.password = password;
    return self;
  }

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
