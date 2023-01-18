import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from '@app/token/dao/entity/token';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTokenDto } from '@app/token/dto/add-token.dto';
import { NetworkService } from '@app/network/services/network.service';

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
    );

    return this.repository.save(token);
  }

  public async getAll(): Promise<Token[]> {
    return this.repository.find();
  }

  public async remove(id: string): Promise<void> {
    await this.repository.delete({
      id,
    });
  }
}
