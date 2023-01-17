import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { Injectable, NotImplementedException } from '@nestjs/common';
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

  public async getById(id: string): Promise<AuthUser> {
    throw new NotImplementedException();
  }

  public async findById(id: string): Promise<AuthUser> {
    throw new NotImplementedException();
  }

  public async findByAddress(address: string): Promise<AuthUser | undefined> {
    return await this.repository.findOne({
      where: {
        address,
      },
    });
  }

  public async findByLogin(login: string): Promise<AuthUser | undefined> {
    throw new NotImplementedException();
  }

  public async getByAddress(address: string): Promise<AuthUser> {
    throw new NotImplementedException();
  }

  public async getByLogin(login: string): Promise<AuthUser> {
    return await this.repository.findOne({
      where: {
        login,
      },
    });
  }
}
