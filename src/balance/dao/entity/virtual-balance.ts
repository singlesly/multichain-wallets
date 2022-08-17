import { Column, Entity, PrimaryColumn } from 'typeorm';

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

  constructor(walletId: string, balance: bigint) {
    this.walletId = walletId;
    this.balance = balance;
  }

  public increase(amount: bigint): VirtualBalance {
    return new VirtualBalance(this.walletId, this.balance + amount);
  }

  public decrease(amount: bigint): VirtualBalance {
    return new VirtualBalance(this.walletId, this.balance - amount);
  }

  public async save(repository: {
    save: (self: VirtualBalance) => Promise<VirtualBalance>;
  }): Promise<VirtualBalance> {
    return await repository.save(this);
  }
}
