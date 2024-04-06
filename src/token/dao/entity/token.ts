import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Network } from '@app/network/dao/entity/network';
import { TokenTypeEnum } from '@app/token/enums/token-type.enum';
import { AbiItem } from 'web3-utils';
import { DEFAULT_ABI } from '@app/ethereum/abi/default.abi';

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

  @Column('text', {
    nullable: true,
  })
  public readonly contractAddress?: string | null;

  @Column('jsonb', {
    default: '{}',
  })
  public readonly abi: AbiItem[] | [] = [];

  constructor(
    symbol: string,
    decimals: number,
    network: Network,
    type: TokenTypeEnum,
    contractAddress?: string,
    abi?: AbiItem[],
  ) {
    this.symbol = symbol;
    this.decimals = decimals;
    this.network = network;
    this.type = type;
    this.contractAddress = contractAddress;
    if (Array.isArray(abi)) {
      this.abi = abi;
    }
  }

  public isNative(): this is { type: TokenTypeEnum.NATIVE } {
    return this.type === TokenTypeEnum.NATIVE;
  }

  public getAbi() {
    if (Array.isArray(this.abi) && this.abi.length > 0) {
      return this.abi;
    }

    return DEFAULT_ABI;
  }
}
