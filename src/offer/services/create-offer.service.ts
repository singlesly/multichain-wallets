import { OfferRepository } from '@app/offer/repositories/offer.repository';
import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from '@app/offer/dto/create-offer.dto';
import { Offer } from '@app/offer/dao/entity/offer';
import { TokenService } from '@app/token/services/token.service';
import { GetWalletService } from '@app/wallet/services/get-wallet.service';

@Injectable()
export class CreateOfferService {
  constructor(
    private readonly offerRepository: OfferRepository,
    private readonly tokenService: TokenService,
    private readonly getWalletService: GetWalletService,
  ) {}

  public async create(dto: CreateOfferDto): Promise<Offer> {
    const token = await this.tokenService.getBySymbol(
      dto.symbol,
      dto.networkCode,
    );
    const wallet = await this.getWalletService.getByAddress(
      dto.liquidityWalletAddress,
    );

    const offer = new Offer(
      token,
      wallet.pubKey,
      dto.volumeScaled,
      dto.direction,
      dto.minScaled,
      dto.maxScaled,
    );

    await this.offerRepository.save(offer);

    return offer;
  }
}
