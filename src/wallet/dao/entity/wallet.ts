import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';

@Entity('wallets')
export class Wallet {
  @PrimaryColumn({
    type: 'uuid',
    generated: 'uuid',
  })
  public readonly id: string;

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
    type: 'enum',
    enum: NetworkEnum,
    nullable: false,
  })
  public readonly network: NetworkEnum;

  @Column({
    type: 'enum',
    enum: CoinEnum,
    nullable: false,
  })
  public readonly coin: CoinEnum;

  @Column('varchar', {
    array: true,
    default: '{}',
  })
  public owners: string[];

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  @DeleteDateColumn()
  public readonly deletedAt?: Date;

  constructor(
    pubKey: string,
    privateKey: string,
    network: NetworkEnum,
    coin: CoinEnum,
    owners: string[] = [],
  ) {
    this.pubKey = pubKey;
    this.privateKey = privateKey;
    this.network = network;
    this.coin = coin;
    this.owners = owners;
  }
}
