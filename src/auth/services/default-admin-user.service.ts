import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { LocalEnvService } from '@app/local-env/services/local-env.service';
import { RoleEnum } from '@app/jwt/enums/role.enum';

@Injectable()
export class DefaultAdminUserService implements OnModuleInit {
  constructor(
    private readonly authUserPgRepository: AuthUserPgRepository,
    private readonly localEnvService: LocalEnvService,
  ) {}

  public async defineDefaultAdmin(): Promise<void> {
    const adminAddresses = this.localEnvService.getAdminAddresses();

    for (const address of adminAddresses) {
      const exists = await this.authUserPgRepository.getByAddress(address);

      if (exists) {
        // TODO: Make admin
        exists.addRole(RoleEnum.ADMIN);
        await this.authUserPgRepository.save(exists);
        continue;
      }

      const admin = AuthUser.createByAddress(address);
      await this.authUserPgRepository.save(admin);
    }
  }

  public async onModuleInit(): Promise<void> {
    await this.defineDefaultAdmin();
  }
}
