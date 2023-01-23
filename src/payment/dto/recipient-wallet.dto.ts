import { IsDefined, IsString } from 'class-validator';

export class RecipientWalletDto {
  @IsDefined()
  @IsString()
  public readonly networkCode: string;

  @IsDefined()
  @IsString()
  public readonly address: string;
}
