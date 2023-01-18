import { NetworkKindEnum } from '@app/network/enums/network-kind.enum';
import {
  BitcoinNetworkInterface,
  EthereumCompatibleNetworkInterface,
  TronCompatibleNetworkInterface,
} from '@app/network/interfaces/network.interface';
import {
  IsDefined,
  IsEnum,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddNetworkDto
  implements
    BitcoinNetworkInterface,
    EthereumCompatibleNetworkInterface,
    TronCompatibleNetworkInterface
{
  @IsDefined()
  @ApiProperty()
  @IsString()
  public readonly code: string;

  @IsDefined()
  @ApiProperty()
  @IsString()
  public readonly name: string;

  @IsDefined()
  @IsEnum(NetworkKindEnum)
  @ApiProperty()
  public readonly kind: NetworkKindEnum.BITCOIN &
    NetworkKindEnum.ETHEREUM_COMPATIBLE &
    NetworkKindEnum.TRON_COMPATIBLE;

  @IsDefined()
  @IsString()
  @IsUrl()
  readonly url: string;

  @ValidateIf(
    (dto: AddNetworkDto) => dto.kind === NetworkKindEnum.TRON_COMPATIBLE,
  )
  @IsString()
  @ApiProperty()
  readonly apiKey: string = '';

  @ValidateIf((dto: AddNetworkDto) => dto.kind === NetworkKindEnum.BITCOIN)
  @IsString()
  @ApiProperty()
  readonly username: string = '';

  @ValidateIf((dto: AddNetworkDto) => dto.kind === NetworkKindEnum.BITCOIN)
  @IsString()
  @ApiProperty()
  readonly password: string = '';
}
