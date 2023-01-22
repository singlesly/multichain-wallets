import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '@app/payment/dao/entity/payment';
import { ApplicationModule } from '@app/application/application.module';
import { NetworkModule } from '@app/network/network.module';
import { TokenModule } from '@app/token/token.module';
import { PaymentRepository } from '@app/payment/repositories/payment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ApplicationModule,
    NetworkModule,
    TokenModule,
  ],
  providers: [PaymentRepository],
})
export class PaymentModule {}
