import { AuthUser } from '@app/auth/dao/entity/auth-user';
import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthUserPgRepository {
  constructor(
    @InjectRepository(AuthUser)
    private readonly repository: Repository<AuthUser>,
  ) {}

  public async save(authUser: AuthUser): Promise<void> {
    await this.repository.save(authUser);
  }

  public async getAll(): Promise<AuthUser[]> {
    return this.repository.find();
  }

  public async getById(id: string): Promise<AuthUser> {
    const found = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!found) {
      throw new NotFoundException('User not found');
    }

    return found;
  }

  public async findById(id: string): Promise<AuthUser> {
    throw new NotImplementedException();
  }

  public async findByAddress(address: string): Promise<AuthUser | null> {
    return await this.repository.findOne({
      where: {
        address,
      },
    });
  }

  public async getByAddress(address: string): Promise<AuthUser> {
    const found = await this.repository.findOne({
      where: {
        address,
      },
    });

    if (!found) {
      throw new NotFoundException('User not found');
    }

    return found;
  }
}
