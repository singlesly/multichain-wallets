import { Injectable } from '@nestjs/common';
import { NetworkService } from '@app/network/services/network.service';
import { TokenService } from '@app/token/services/token.service';
import { GroupAmount } from '@app/payment/dao/entity/payment';
import { GroupAmountDto } from '@app/payment/dto/group-amount.dto';

@Injectable()
export class CheckGroupAmountService {
  constructor(
    private readonly networkService: NetworkService,
    private readonly tokenService: TokenService,
  ) {}

  public async check(groupAmounts: GroupAmountDto[]): Promise<GroupAmount> {
    const amounts = [] as GroupAmount;

    for (const groupAmount of groupAmounts) {
      if (groupAmount.isFiat) {
        amounts.push({
          amountScaled: groupAmount.amountScaled,
          decimals: 0,
          networkCode: 'rub',
          tokenSymbol: 'rub',
          isFiat: true,
        });
        continue;
      }

      const network = await this.networkService.getByCode(
        groupAmount.networkCode,
      );
      const token = await this.tokenService.getBySymbol(
        groupAmount.tokenSymbol,
        network.code,
      );

      amounts.push({
        amountScaled: groupAmount.amountScaled,
        decimals: token.decimals,
        networkCode: network.code,
        tokenSymbol: token.symbol,
        isFiat: false,
      });
    }

    return amounts;
  }
}
