import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { CreatePaymentService } from '@app/payment/services/create-payment.service';
import { CreatePaymentDto } from '@app/payment/dto/create-payment.dto';
import { PaymentResponse } from '@app/payment/controllers/payment.response';
import { AppGuard } from '@app/application/guard/app.guard';
import { GetPaymentService } from '@app/payment/services/get-payment.service';
import { PayPaymentDto } from '@app/payment/dto/pay-payment.dto';
import { PayPaymentService } from '@app/payment/services/pay-payment.service';
import { HttpEpayService } from '@app/http-epay/services/http-epay.service';
import { TinkoffService } from '@app/tinkoff/services/tinkoff.service';

@Controller()
@ApiTags('Payments')
export class PaymentController {
  constructor(
    private readonly createPaymentService: CreatePaymentService,
    private readonly getPaymentService: GetPaymentService,
    private readonly payPaymentService: PayPaymentService,
    private readonly tinkoffService: TinkoffService,
  ) {}

  @Post('payment')
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  public async create(@Body() dto: CreatePaymentDto): Promise<PaymentResponse> {
    const payment = await this.createPaymentService.create(dto);

    return new PaymentResponse(payment);
  }

  @Get('payments')
  @UseGuards(AppGuard)
  @ApiBasicAuth()
  public async getPayments(): Promise<PaymentResponse[]> {
    const payments = await this.getPaymentService.getPayments({});

    return payments.map((payment) => new PaymentResponse(payment));
  }

  @Get('payment/:paymentId')
  public async getPayment(
    @Param('paymentId') paymentId: string,
  ): Promise<PaymentResponse> {
    const payment = await this.getPaymentService.getPaymentById(paymentId);

    return new PaymentResponse(payment);
  }

  @Post('payment/:paymentId/pay')
  public async pay(
    @Param('paymentId') paymentId: string,
    @Body() dto: PayPaymentDto,
  ): Promise<PaymentResponse> {
    const payment = await this.payPaymentService.pay({
      paymentId,
      ...dto,
    });

    return new PaymentResponse(payment);
  }

  @Get('payment/:paymentId/pay/fiat')
  public async fiatPay(@Param('paymentId') paymentId: string) {
    const payment = await this.getPaymentService.getPaymentById(paymentId);

    return this.tinkoffService.getPaymentLink({
      orderId: payment.orderId,
      amount: Number(payment.getFiatAmount().amountScaled),
    });
  }
}
