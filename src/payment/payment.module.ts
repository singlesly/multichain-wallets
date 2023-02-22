import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '@app/payment/dao/entity/payment';
import { ApplicationModule } from '@app/application/application.module';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { PaymentRepository } from '@app/payment/repositories/payment.repository';
import { CreatePaymentService } from '@app/payment/services/create-payment.service';
import { CheckWalletService } from '@app/payment/services/check-wallet.service';
import { CheckOrderAlreadyExistsService } from '@app/payment/services/check-order-already-exists.service';
import { CheckGroupAmountService } from '@app/payment/services/check-group-amount.service';
import { CheckAmountCompatibleWalletService } from '@app/payment/services/check-amount-compatible-wallet.service';
import { WalletModule } from '@app/wallet/wallet.module';
import { PaymentController } from '@app/payment/controllers/payment.controller';
import { GetPaymentService } from '@app/payment/services/get-payment.service';
import { BridgeModule } from '@app/bridge/bridge.module';
import { PayPaymentService } from '@app/payment/services/pay-payment.service';
import { BullModule } from '@nestjs/bull';
import { PaymentConsumerEnum } from '@app/payment/enums/payment-consumer.enum';
import { PaymentProcessor } from '@app/payment/processors/payment.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    BullModule.registerQueue({
      name: PaymentConsumerEnum.PAYMENT_QUEUE,
    }),
    ApplicationModule,
    NetworkModule,
    TokenModule,
    WalletModule,
    BridgeModule,
  ],
  controllers: [PaymentController],
  providers: [
    CreatePaymentService,
    CheckWalletService,
    CheckOrderAlreadyExistsService,
    CheckGroupAmountService,
    CheckAmountCompatibleWalletService,
    PaymentRepository,
    GetPaymentService,
    CreatePaymentService,
    PayPaymentService,
    PaymentProcessor,
  ],
})
export class PaymentModule {}
