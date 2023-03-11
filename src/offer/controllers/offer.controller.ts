import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOfferService } from '@app/offer/services/create-offer.service';
import { CreateOfferDto } from '@app/offer/dto/create-offer.dto';
import { Offer } from '@app/offer/dao/entity/offer';
import { OfferRepository } from '@app/offer/repositories/offer.repository';
import { GetPaymentLinkResult } from '@app/tinkoff/services/tinkoff.service';
import { GetOfferPaymentLinkDto } from '@app/offer/dto/get-offer-payment-link.dto';
import { GetPaymentLinkOfferService } from '@app/offer/services/get-payment-link-offer.service';
import { WebhookDto } from '@app/tinkoff/dto/webhook.dto';
import { PaymentDataInterface } from '@app/offer/interfaces/payment-data.interface';
import { ConfirmOfferService } from '@app/offer/services/confirm-offer.service';

@Controller()
@ApiTags('Offers')
export class OfferController {
  constructor(
    private readonly createOfferService: CreateOfferService,
    private readonly getPaymentLinkOfferService: GetPaymentLinkOfferService,
    private readonly offerRepository: OfferRepository,
    private readonly confirmOfferService: ConfirmOfferService,
  ) {}

  @Get('offers')
  public async getAll(): Promise<Offer[]> {
    return this.offerRepository.getAll();
  }

  @Post('offer/:offerId/pay')
  public async getOfferPaymentLink(
    @Param('offerId') offerId: string,
    @Body() dto: GetOfferPaymentLinkDto,
  ): Promise<GetPaymentLinkResult> {
    return this.getPaymentLinkOfferService.getPaymentLink(offerId, dto);
  }

  @Post('offer')
  public async create(@Body() dto: CreateOfferDto): Promise<Offer> {
    return this.createOfferService.create(dto);
  }

  @Post('/offer/webhook')
  @HttpCode(200)
  public async handleWebhook(
    @Body() dto: WebhookDto<PaymentDataInterface>,
  ): Promise<string> {
    await this.confirmOfferService.confirm(dto);
    return 'OK';
  }
}
