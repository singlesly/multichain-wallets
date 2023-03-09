import { Injectable } from '@nestjs/common';
import { GetPaymentService } from '@app/payment/services/get-payment.service';
import {
  GetPaymentLinkResult,
  TinkoffService,
} from '@app/tinkoff/services/tinkoff.service';

@Injectable()
export class GetPaymentLinkService {
  constructor(
    private readonly getPaymentService: GetPaymentService,
    private readonly tinkoffService: TinkoffService,
  ) {}

  public async getPaymentLink(
    paymentId: string,
  ): Promise<GetPaymentLinkResult> {
    const payment = await this.getPaymentService.getPaymentById(paymentId);

    return this.tinkoffService.getPaymentLink({
      orderId: payment.orderId,
      amount: Number(payment.getFiatAmount().amountScaled),
    });
  }
}
