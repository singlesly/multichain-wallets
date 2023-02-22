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
import { NotFoundException } from '@nestjs/common';

export type GroupAmountItem = {
  networkCode: string;
  tokenSymbol: string;
  decimals: number;
  amountScaled: string;
};

export type GroupAmount = GroupAmountItem[];

export type RecipientWalletItem = {
  networkCode: string;
  address: string;
};

export type Wallets = RecipientWalletItem[];

export type PaidAmount = {
  decimals: number;
  amountScaled: string;
};

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @ManyToOne(() => Application, {
    eager: true,
  })
  @JoinColumn()
  public readonly application: Application;

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
  public paidNetworkCode: string | null = null;

  @Column('text', {
    nullable: true,
    default: null,
  })
  public paidTokenSymbol: string | null = null;

  @Column('jsonb', {
    nullable: true,
    default: null,
  })
  public paidAmount: PaidAmount | null = null;

  @Column('text', {
    nullable: true,
    default: null,
  })
  public recipientWalletAddress: string | null = null;

  @Column('text', {
    nullable: true,
    default: null,
  })
  public txId: string | null = null;

  @Column('timestamp with time zone', {
    nullable: true,
    default: null,
  })
  public paymentDate: Date | null = null;

  @Column('text', {
    nullable: true,
    default: null,
  })
  public webhookStatus: PaymentWebhookStatusEnum | null = null;

  @Column('text')
  public status: PaymentStatusEnum;

  @Column('text')
  public declinedReason = '';

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  constructor(
    application: Application,
    amount: GroupAmount,
    wallets: Wallets,
    orderId: string,
    webhook: string | null = null,
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

    return this;
  }

  public confirm() {
    this.status = PaymentStatusEnum.PAID;

    return this;
  }

  public decline(reason = ''): this {
    this.declinedReason = reason;

    return this;
  }

  public getRequiredAmount(
    networkCode: string,
    symbol: string,
  ): GroupAmountItem {
    const item = this.groupAmount.find(
      (item) => item.networkCode === networkCode && item.tokenSymbol === symbol,
    );
    if (!item) {
      throw new NotFoundException('Required amount not specified');
    }

    return item;
  }

  public getRequiredRecipient(networkCode: string): RecipientWalletItem {
    const item = this.wallets.find((item) => item.networkCode == networkCode);

    if (!item) {
      throw new NotFoundException('Not found recipient');
    }

    return item;
  }
}
