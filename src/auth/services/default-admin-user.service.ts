import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { LocalEnvService } from '@app/local-env/services/local-env.service';
import { LocalEnvPathEnum } from '@app/local-env/contants/local-env-path.enum';

@Injectable()
export class DefaultAdminUserService implements OnModuleInit {
  constructor(
    private readonly authUserPgRepository: AuthUserPgRepository,
    private readonly localEnvService: LocalEnvService,
  ) {}

  public async defineDefaultAdmin(): Promise<AuthUser> {
    const login = this.localEnvService.getSafety(LocalEnvPathEnum.ADMIN_LOGIN);
    const password = this.localEnvService.getSafety(
      LocalEnvPathEnum.ADMIN_PASSWORD,
    );
    const exists = await this.authUserPgRepository.getByLogin(login);
    if (exists) {
      return exists;
    }

    const authUser = AuthUser.createByLogin(login, password);
    await this.authUserPgRepository.save(authUser);

    return authUser;
  }

  public async onModuleInit(): Promise<void> {
    await this.defineDefaultAdmin();
  }
}
