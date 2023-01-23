import { GroupAmount, Payment, Wallets } from '@app/payment/dao/entity/payment';
import { ApplicationResponse } from '@app/application/interfaces/application.response';
import { ApiProperty } from '@nestjs/swagger';

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

  constructor(payment: Payment) {
    this.id = payment.id;
    this.application = {
      authId: payment.application.authId(),
      name: payment.application.name,
    };
    this.webhook = payment.webhook;
    this.groupAmount = payment.groupAmount;
    this.wallets = payment.wallets;
    this.orderId = payment.orderId;
  }
}
