import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NetworkEnum } from '@app/common/network.enum';
import { CoinEnum } from '@app/common/coin.enum';

const TABLE_NAME = 'virtual_balances';

@Entity(TABLE_NAME)
export class VirtualBalance {
  @PrimaryColumn('uuid')
  public readonly walletId: string;

  @Column({
    type: 'numeric',
    default: '0',
  })
  public readonly balance: bigint;

  @Column({
    type: 'enum',
    enum: NetworkEnum,
  })
  public readonly network: NetworkEnum;

  @Column({
    type: 'enum',
    enum: CoinEnum,
  })
  public readonly coin: CoinEnum;

  constructor(
    walletId: string,
    balance: bigint,
    network: NetworkEnum,
    coin: CoinEnum,
  ) {
    this.walletId = walletId;
    this.balance = balance;
    this.network = network;
    this.coin = coin;
  }

  public increase(amount: bigint): VirtualBalance {
    return new VirtualBalance(
      this.walletId,
      this.balance + amount,
      this.network,
      this.coin,
    );
  }

  public decrease(amount: bigint): VirtualBalance {
    return new VirtualBalance(
      this.walletId,
      this.balance - amount,
      this.network,
      this.coin,
    );
  }

  public async save(repository: {
    save: (self: VirtualBalance) => Promise<VirtualBalance>;
  }): Promise<VirtualBalance> {
    return await repository.save(this);
  }
}
