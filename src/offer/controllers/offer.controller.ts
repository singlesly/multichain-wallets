import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOfferService } from '@app/offer/services/create-offer.service';
import { CreateOfferDto } from '@app/offer/dto/create-offer.dto';
import { Offer } from '@app/offer/dao/entity/offer';

@Controller()
@ApiTags('Offers')
export class OfferController {
  constructor(private readonly createOfferService: CreateOfferService) {}

  @Post('offer')
  public async create(@Body() dto: CreateOfferDto): Promise<Offer> {
    return this.createOfferService.create(dto);
  }
}
