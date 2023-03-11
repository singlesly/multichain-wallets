import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OfferHistoryService } from '@app/offer-history/services/offer-history.service';
import { OfferHistory } from '@app/offer-history/dao/entity/offer-history';
import { RequestPayload } from '@app/auth/decorators/request-payload';
import { RequestMeta } from '@app/auth/contants';
import { AuthGuard } from '@app/auth/guards/auth.guard';

@Controller()
@ApiTags('Offers History')
export class OfferHistoryController {
  constructor(private readonly offerHistoryService: OfferHistoryService) {}

  @Get('offer-history')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async getAll(
    @RequestPayload() payload: RequestMeta,
  ): Promise<OfferHistory[]> {
    return this.offerHistoryService.getByUserId(payload.userId!);
  }
}
