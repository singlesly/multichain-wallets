import { ApiProperty } from '@nestjs/swagger';
import { Balance } from '@app/bridge/interfaces/agent-service.interface';
import { bignumber, chain, pow } from 'mathjs';

export class BalanceResponse {
  @ApiProperty()
  public amount: string;

  @ApiProperty()
  public decimals: number;

  @ApiProperty()
  public formattedAmount: string;

  constructor(balance: Balance) {
    this.amount = balance.amount.toString();
    this.decimals = balance.decimals;
    this.formattedAmount = chain(bignumber(this.amount))
      .divide(pow(10, this.decimals))
      .done()
      .toString();
  }
}
