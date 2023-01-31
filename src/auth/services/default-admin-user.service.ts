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

  public async defineDefaultAdmin(): Promise<void> {
    const adminAddresses = this.localEnvService.getAdminAddresses();

    for (const address of adminAddresses) {
      const exists = await this.authUserPgRepository.findByAddress(address);

      if (exists) {
        // TODO: Make admin
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
