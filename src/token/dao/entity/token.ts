import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Network } from '@app/network/dao/entity/network';
import { TokenTypeEnum } from '@app/token/enums/token-type.enum';
import { FiatDistributionEnum } from '@app/token/enums/fiat-distribution.enum';
import { FiatDistributionOptions } from '@app/token/interfaces/fiat-distribution.options';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string;

  @Column()
  public readonly symbol: string;

  @Column('int')
  public readonly decimals: number;

  @ManyToOne(() => Network, {
    eager: true,
  })
  @JoinColumn()
  public network: Network;

  @Column('text')
  public readonly type: TokenTypeEnum;

  @Column('jsonb', {
    default: '{"type": "UNAVAILABLE"}',
  })
  public fiatDistributionOptions: FiatDistributionOptions = {
    type: FiatDistributionEnum.UNAVAILABLE,
  };

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

  public isNative(): this is { type: TokenTypeEnum.NATIVE } {
    return this.type === TokenTypeEnum.NATIVE;
  }

  public useFiatOptions(fiatOptions: FiatDistributionOptions): this {
    this.fiatDistributionOptions = fiatOptions;
    return this;
  }
}
