import {
  GroupAmount,
  PaidAmount,
  Payment,
  Wallets,
} from '@app/payment/dao/entity/payment';
import { ApplicationResponse } from '@app/application/interfaces/application.response';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatusEnum } from '@app/payment/enums/payment-status.enum';
import { PaymentWebhookStatusEnum } from '@app/payment/enums/payment-webhook-status.enum';

export class PaymentResponse {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly application: ApplicationResponse;

  @ApiProperty()
  public readonly webhook: string | null;

  @ApiProperty()
  public readonly groupAmount: GroupAmount;

  @ApiProperty()
  public readonly wallets: Wallets;

  public readonly orderId: string;

  public readonly status: PaymentStatusEnum;

  public readonly paidNetworkCode: string | null;
  public readonly paidTokenSymbol: string | null;
  public readonly paidAmount: PaidAmount | null;
  public readonly recipientWalletAddress: string | null;
  public readonly txId: string | null;
  public readonly paymentDate: Date | null;
  public readonly webhookStatus: PaymentWebhookStatusEnum | null;
  public readonly declinedReason: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(payment: Payment) {
    this.id = payment.id;
    this.application = {
      authId: payment.application.authId(),
      name: payment.application.name,
      id: payment.application.id,
      owner: {
        address: payment.application.owner?.address,
        id: payment.application.owner?.id,
      },
    };
    this.webhook = payment.webhook;
    this.groupAmount = payment.groupAmount;
    this.wallets = payment.wallets;
    this.orderId = payment.orderId;
    this.status = payment.status;
    this.declinedReason = payment.declinedReason;
    this.createdAt = payment.createdAt;
    this.updatedAt = payment.updatedAt;
    this.paidNetworkCode = payment.paidNetworkCode as string;
    this.paidTokenSymbol = payment.paidTokenSymbol as string;
    this.paidAmount = payment.paidAmount as PaidAmount;
    this.recipientWalletAddress = payment.recipientWalletAddress;
    this.txId = payment.txId;
    this.paymentDate = payment.paymentDate;
    this.webhookStatus = payment.webhookStatus;
  }
}
