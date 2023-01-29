import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CoinEnum } from '@app/common/coin.enum';
import { NetworkEnum } from '@app/common/network.enum';
import { BigIntColumn } from '@app/common/typeorm/bigint.column';

const TABLE_NAME = 'virtual_transactions';

@Entity(TABLE_NAME)
export class VirtualTransaction {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({
    type: 'text',
  })
  public readonly from: string;

  @Column({
    type: 'text',
  })
  public readonly to: string;

  @BigIntColumn()
  public readonly amount: bigint;

  @Column({ type: 'enum', enum: NetworkEnum })
  public readonly network: NetworkEnum;

  @Column({ type: 'enum', enum: CoinEnum })
  public readonly coin: CoinEnum;

  @Column({
    type: 'text',
    default: '',
  })
  public readonly note!: string;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  constructor(
    from: string,
    to: string,
    amount: bigint,
    network: NetworkEnum,
    coin: CoinEnum,
    id: string,
  ) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.network = network;
    this.coin = coin;
    this.id = id;
  }
}
