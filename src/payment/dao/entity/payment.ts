import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from '@app/application/dao/entity/application';
import { PaymentStatusEnum } from '@app/payment/enums/payment-status.enum';
import { PaymentWebhookStatusEnum } from '@app/payment/enums/payment-webhook-status.enum';
import { v4 } from 'uuid';
import { Network } from '@app/network/dao/entity/network';
import { Token } from '@app/token/dao/entity/token';

export type GroupAmount = {
  networkCode: string;
  tokenSymbol: string;
  decimals: number;
  amountScaled: string;
}[];

export type Wallets = {
  networkCode: string;
  address: string;
}[];

export type PaidAmount = {
  decimals: number;
  amountScaled: string;
};

@Entity('Payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ManyToOne(() => Application, {
    eager: true,
  })
  @JoinColumn()
  public readonly application: Application | null;

  @Column('text', {
    nullable: true,
  })
  public readonly webhook: string | null;

  @Column('jsonb')
  public readonly groupAmount: GroupAmount;

  @Column('jsonb')
  public readonly wallets: Wallets;

  @Column({
    unique: true,
  })
  public readonly orderId: string;

  @Column('text', {
    nullable: true,
    default: null,
  })
  private paidNetworkCode: string | null;

  @Column({
    nullable: true,
    default: null,
  })
  private paidTokenSymbol: string | null;

  @Column('jsonb', {
    nullable: true,
    default: null,
  })
  private paidAmount: PaidAmount | null;

  @Column('text', {
    nullable: true,
    default: null,
  })
  private recipientWalletAddress: string | null;

  @Column('text', {
    nullable: true,
    default: null,
  })
  private txId: string | null;

  @Column('timestamp with time zone', {
    nullable: true,
    default: null,
  })
  private paymentDate: Date | null;

  @Column('text', {
    nullable: true,
    default: null,
  })
  private webhookStatus: PaymentWebhookStatusEnum | null;

  @Column('text')
  private status: PaymentStatusEnum;

  @Column('text')
  private declinedReason = '';

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public readonly updatedAt: Date;

  constructor(
    application: Application,
    amount: GroupAmount,
    wallets: Wallets,
    orderId: string,
    webhook: string = null,
    id: string = v4(),
  ) {
    this.id = id;
    this.application = application;
    this.orderId = orderId;
    this.groupAmount = amount;
    this.wallets = wallets;
    this.webhook = webhook;
    this.status = PaymentStatusEnum.AWAITING_PAYMENT;
  }

  public pay(
    network: Network,
    token: Token,
    amount: PaidAmount,
    recipientWalletAddress: string,
    txId: string,
    paymentDate: Date = new Date(),
  ) {
    this.paidNetworkCode = network.code;
    this.paidTokenSymbol = token.symbol;
    this.paidAmount = amount;
    this.recipientWalletAddress = recipientWalletAddress;
    this.txId = txId;
    this.paymentDate = paymentDate;

    this.status = PaymentStatusEnum.PAID;

    return this;
  }

  public decline(reason = ''): this {
    this.declinedReason = reason;

    return this;
  }
}
