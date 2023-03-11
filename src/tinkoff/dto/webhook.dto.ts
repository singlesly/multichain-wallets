import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { PaymentStatusEnum } from '@app/tinkoff/enums/payment-status.enum';

export class WebhookDto<T = Record<string, string>> {
  @ApiProperty()
  public readonly DATA?: T;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly OrderId!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly Status!: PaymentStatusEnum;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  public readonly Amount!: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly CustomerKey!: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public readonly Token!: string;
}
