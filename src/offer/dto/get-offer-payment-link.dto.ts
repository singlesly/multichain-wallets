import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumberString, IsString } from 'class-validator';

export class GetOfferPaymentLinkDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public recipientWalletAddress!: string;

  @ApiProperty({
    example: '1000000',
  })
  @IsDefined()
  @IsNumberString()
  public amountScaled!: string;
}
