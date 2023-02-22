import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';
import { WalletTypeEnum } from '@app/wallet/constants/wallet-type.enum';

@Entity('wallets')
export class Wallet {
  @PrimaryColumn({
    type: 'uuid',
    generated: 'uuid',
  })
  public readonly id!: string;

  @Column({
    type: 'varchar',
    length: 4096,
    nullable: false,
  })
  public readonly pubKey: string;

  @Column({
    type: 'varchar',
    length: 4096,
    nullable: false,
  })
  public readonly privateKey: string;

  @Column({
    enum: WalletTypeEnum,
    type: 'enum',
    default: WalletTypeEnum.MAIN,
  })
  public readonly type: WalletTypeEnum;

  @Column({
    type: 'text',
    nullable: false,
  })
  public readonly networkCode: string;

  @Column('varchar', {
    array: true,
    default: '{}',
  })
  public owners: string[];

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  @DeleteDateColumn()
  public readonly deletedAt?: Date;

  constructor(
    pubKey: string,
    privateKey: string,
    networkCode: string,
    owners: string[] = [],
    type: WalletTypeEnum = WalletTypeEnum.MAIN,
  ) {
    this.pubKey = pubKey;
    this.privateKey = privateKey;
    this.networkCode = networkCode;
    this.owners = owners;
    this.type = type;
  }

  public checkOwnerOrFail(owner: string): void {
    const has = (this.owners || []).some((item) => item === owner);
    if (!has) {
      throw new BaseException({
        statusCode: WebErrorsEnum.PERMISSION_DENIED,
        message: 'You are not owner of wallet',
      });
    }
  }
}
