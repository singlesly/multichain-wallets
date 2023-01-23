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

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ApplicationModule,
    NetworkModule,
    TokenModule,
  ],
  providers: [
    CreatePaymentService,
    CheckWalletService,
    CheckOrderAlreadyExistsService,
    CheckGroupAmountService,
    CheckAmountCompatibleWalletService,
    PaymentRepository,
  ],
})
export class PaymentModule {}
