import { Injectable } from '@nestjs/common';
import { GroupAmount, Wallets } from '@app/payment/dao/entity/payment';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

@Injectable()
export class CheckAmountCompatibleWalletService {
  public guardAmountCompatibleWallet(
    wallets: Wallets,
    amounts: GroupAmount,
  ): void {
    for (const amount of amounts) {
      const noWallet = wallets.some(
        (wallet) => wallet.networkCode !== amount.networkCode,
      );
      if (noWallet) {
        throw new BaseException({
          message: `No wallet for ${amount.networkCode}`,
          statusCode: WebErrorsEnum.DOMAIN_ERROR,
        });
      }
    }
  }
}
