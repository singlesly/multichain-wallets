import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletTypeEnum } from '@app/wallet/constants/wallet-type.enum';
import { EncryptedDataInterface } from '@app/encrypt/interfaces/encrypted-data.interface';

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
    type: 'jsonb',
    nullable: false,
  })
  public readonly privateKey: EncryptedDataInterface;

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
    privateKey: EncryptedDataInterface,
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
}
