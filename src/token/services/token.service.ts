import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from '@app/token/dao/entity/token';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTokenDto } from '@app/token/dto/add-token.dto';
import { NetworkService } from '@app/network/services/network.service';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { BaseException } from '@app/common/base-exception';
import { WebErrorsEnum } from '@app/common/web-errors.enum';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly repository: Repository<Token>,
    private readonly networkService: NetworkService,
  ) {}

  public async add(dto: AddTokenDto): Promise<Token> {
    const network = await this.networkService.getByCode(dto.networkCode);
    const token = new Token(
      dto.symbol,
      dto.decimals,
      network,
      dto.type,
      dto.contractAddress,
    ).useFiatOptions(dto.fiatOptions);

    return this.repository.save(token);
  }

  public async getAll(): Promise<Token[]> {
    return this.repository.find();
  }

  public async getByNetwork(networkCode: string): Promise<Token[]> {
    return this.repository.find({
      where: {
        network: {
          code: networkCode,
        },
      },
      relations: ['network'],
    });
  }

  public async getBySymbol(
    symbol: string,
    networkCode?: string,
  ): Promise<Token> {
    const where: FindOptionsWhere<Token> = {
      symbol,
    };
    if (networkCode) {
      where.network = {
        code: networkCode,
      };
    }

    const token = await this.repository.findOne({
      where,
      relations: ['network'],
    });

    if (!token) {
      throw new BaseException({
        message: 'Token not found',
        statusCode: WebErrorsEnum.NOT_FOUND,
      });
    }

    return token;
  }

  public async remove(id: string): Promise<void> {
    await this.repository.delete({
      id,
    });
  }
}
