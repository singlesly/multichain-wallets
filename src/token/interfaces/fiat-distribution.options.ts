import { FiatDistributionEnum } from '@app/token/enums/fiat-distribution.enum';

export interface FiatDistributionOptions {
  type: FiatDistributionEnum;
  dispenserWalletAddress?: string;
}
