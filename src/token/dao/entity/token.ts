import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Network } from '@app/network/dao/entity/network';
import { TokenTypeEnum } from '@app/token/enums/token-type.enum';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column()
  public readonly symbol: string;

  @Column('int')
  public readonly decimals: number;

  @ManyToOne(() => Network, {
    eager: true,
  })
  @JoinColumn()
  public readonly network: Network;

  @Column('text')
  public readonly type: TokenTypeEnum;

  @Column('text', {
    nullable: true,
  })
  public readonly contractAddress?: string | null;

  constructor(
    symbol: string,
    decimals: number,
    network: Network,
    type: TokenTypeEnum,
    contractAddress?: string,
  ) {
    this.symbol = symbol;
    this.decimals = decimals;
    this.network = network;
    this.type = type;
    this.contractAddress = contractAddress;
  }
}
