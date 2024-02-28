import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { RoleEnum } from '@app/jwt/enums/role.enum';

const TABLE_NAME = 'auth_users';

@Entity(TABLE_NAME)
export class AuthUser {
  @PrimaryColumn({
    type: 'uuid',
  })
  public readonly id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  public address!: string;

  @Column({
    type: 'jsonb',
    default: '{}',
  })
  public roles: RoleEnum[] = [RoleEnum.USER];

  @CreateDateColumn()
  public readonly createdAt!: Date;

  constructor() {
    this.id = v4();
  }

  public static createByAddress(address: string) {
    const authUser = new AuthUser();
    authUser.address = address;
    return authUser;
  }

  public getRoles(): RoleEnum[] {
    return this.roles || [];
  }

  public addRole(role: RoleEnum): this {
    this.roles = [...this.getRoles(), role];
    return this;
  }
}
