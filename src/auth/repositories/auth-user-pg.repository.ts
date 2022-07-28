import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { NotImplementedException } from '@nestjs/common';

export class AuthUserPgRepository {
  public async save(authUser: AuthUser): Promise<void> {
    throw new NotImplementedException();
  }

  public async getById(id: string): Promise<AuthUser> {
    throw new NotImplementedException();
  }

  public async findById(id: string): Promise<AuthUser> {
    throw new NotImplementedException();
  }

  public async findByAddress(address: string): Promise<AuthUser | undefined> {
    throw new NotImplementedException();
  }

  public async findByLogin(login: string): Promise<AuthUser | undefined> {
    throw new NotImplementedException();
  }

  public async getByAddress(address: string): Promise<AuthUser> {
    throw new NotImplementedException();
  }

  public async getByLogin(login: string): Promise<AuthUser> {
    throw new NotImplementedException();
  }
}
