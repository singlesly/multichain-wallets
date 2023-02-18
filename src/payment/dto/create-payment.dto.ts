import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { GroupAmountDto } from '@app/payment/dto/group-amount.dto';
import { RecipientWalletDto } from '@app/payment/dto/recipient-wallet.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  public readonly orderId!: string;

  @IsDefined()
  @IsUUID('4')
  @ApiProperty()
  public readonly applicationId!: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  public readonly webhook: string | null = null;

  @IsDefined()
  @ValidateNested({
    each: true,
  })
  @IsArray()
  @ApiProperty({
    type: GroupAmountDto,
    isArray: true,
  })
  @Type(() => GroupAmountDto)
  public readonly groupAmount: GroupAmountDto[] = [];

  @IsDefined()
  @ValidateNested({
    each: true,
  })
  @IsArray()
  @ApiProperty({
    type: RecipientWalletDto,
    isArray: true,
  })
  @Type(() => RecipientWalletDto)
  public readonly recipientWallets: RecipientWalletDto[] = [];
}
