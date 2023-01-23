import {
  IsArray,
  IsDefined,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { GroupAmountDto } from '@app/payment/dto/group-amount.dto';
import { RecipientWalletDto } from '@app/payment/dto/recipient-wallet.dto';

export class CreatePaymentDto {
  @IsDefined()
  @IsString()
  public readonly orderId: string;

  @IsDefined()
  @IsUUID('4')
  public readonly applicationId: string;

  @IsOptional()
  @IsUrl()
  public readonly webhook: string | null = null;

  @IsDefined()
  @ValidateNested({
    each: true,
  })
  @IsArray()
  @MinLength(1)
  public readonly groupAmount: GroupAmountDto[];

  @IsDefined()
  @ValidateNested({
    each: true,
  })
  @IsArray()
  @MinLength(1)
  public readonly recipientWallets: RecipientWalletDto[];
}
