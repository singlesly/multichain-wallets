import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentService } from '@app/payment/services/create-payment.service';
import { CreatePaymentDto } from '@app/payment/dto/create-payment.dto';
import { PaymentResponse } from '@app/payment/controllers/payment.response';

@Controller()
@ApiTags('Payments')
export class PaymentController {
  constructor(private readonly paymentService: CreatePaymentService) {}

  @Post('payment')
  public async create(@Body() dto: CreatePaymentDto): Promise<PaymentResponse> {
    const payment = await this.paymentService.create(dto);

    return new PaymentResponse(payment);
  }
}
