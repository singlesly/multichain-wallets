import { Column, Entity, PrimaryColumn } from 'typeorm';

const TABLE_NAME = 'virtual_balances';

@Entity(TABLE_NAME)
export class VirtualBalance {
  @PrimaryColumn('uuid')
  public walletId: string;

  @Column({
    type: 'numeric',
    default: '0',
  })
  public balance: bigint;
}
