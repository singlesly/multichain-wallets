import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponse {
  @ApiProperty({
    type: 'string',
  })
  public readonly transactionId: string;

  constructor(transactionId: string) {
    this.transactionId = transactionId;
  }
}
