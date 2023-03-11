import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from '@app/token/dao/entity/token';
import { OfferDirectionEnum } from '@app/offer/enums/offer-direction.enum';

@Entity('offers_history')
export class OfferHistory {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string;

  @ManyToOne(() => Token, {
    eager: true,
  })
  public readonly token: Token;

  @Column({
    type: 'varchar',
  })
  public readonly baseAmountScaled: string;

  @Column({
    type: 'uuid',
  })
  public readonly userId: string;

  @Column({
    type: 'varchar',
  })
  public readonly quoteAmountScaled: string;

  @Column({
    type: 'varchar',
  })
  public readonly txId: string;

  @Column({
    type: 'varchar',
  })
  public readonly direction: OfferDirectionEnum;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  constructor(
    token: Token,
    userId: string,
    baseAmountScaled: string,
    quoteAmountScaled: string,
    txId: string,
    direction: OfferDirectionEnum,
  ) {
    this.token = token;
    this.userId = userId;
    this.baseAmountScaled = baseAmountScaled;
    this.quoteAmountScaled = quoteAmountScaled;
    this.txId = txId;
    this.direction = direction;
  }
}
