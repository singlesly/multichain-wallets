import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Network } from '@app/network/dao/entity/network';
import { InjectRepository } from '@nestjs/typeorm';
import { AddNetworkDto } from '@app/network/dto/add-network.dto';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Network)
    private readonly repository: Repository<Network>,
  ) {}

  public async getAll(): Promise<Network[]> {
    return this.repository.find();
  }

  public async getByCode(code: string): Promise<Network> {
    const network = await this.repository.findOne({
      where: {
        code,
      },
    });

    if (!network) {
      throw new NotFoundException('network not found');
    }

    return network;
  }

  public async findByCode(code: string): Promise<Network | null> {
    return await this.repository.findOne({
      where: {
        code,
      },
    });
  }

  public async add(dto: AddNetworkDto): Promise<Network> {
    const exists = await this.repository.exist({
      where: {
        code: dto.code,
      },
    });
    if (exists) {
      throw new ForbiddenException('Network code already used');
    }

    const network = new Network(dto.code, dto.name, dto.url, dto.kind, {
      code: dto.code,
      kind: dto.kind,
      url: dto.url,
      name: dto.name,
      apiKey: dto.apiKey,
      password: dto.password,
      username: dto.username,
    });

    return this.repository.save(network);
  }

  public async remove(code: string): Promise<void> {
    await this.repository.delete({
      code,
    });
  }
}
