import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NetworkKindEnum } from '@app/network/enums/network-kind.enum';
import {
  EthereumCompatibleNetworkInterface,
  NetworkInterface,
  TronCompatibleNetworkInterface,
} from '@app/network/interfaces/network.interface';

@Entity('networks')
export class Network {
  @PrimaryColumn()
  public readonly code: string;

  @Column()
  public readonly name: string;

  @Column()
  public readonly url: string;

  @Column('text')
  public readonly kind: NetworkKindEnum;

  @Column('simple-json', {
    default: '{}',
  })
  public readonly options: NetworkInterface;

  constructor(
    code: string,
    name: string,
    url: string,
    kind: NetworkKindEnum,
    options: NetworkInterface,
  ) {
    this.code = code;
    this.name = name;
    this.url = url;
    this.kind = kind;
    this.options = options;
  }

  public isTronCompatible(): this is {
    options: TronCompatibleNetworkInterface;
  } {
    return this.options.kind === NetworkKindEnum.TRON_COMPATIBLE;
  }

  public isEthereumCompatible(): this is {
    options: EthereumCompatibleNetworkInterface;
  } {
    return this.options.kind === NetworkKindEnum.ETHEREUM_COMPATIBLE;
  }
}
