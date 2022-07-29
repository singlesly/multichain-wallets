import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { Injectable } from '@nestjs/common';
import { AuthResult } from '@app/auth/services/auth.service';
import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { TokenService } from '@app/auth/services/token.service';
import Web3 from 'web3';

@Injectable()
export class Web3AuthService {
  private readonly signMessage =
    Buffer.from('Authentication').toString('base64');

  constructor(
    private readonly authUserPgRepository: AuthUserPgRepository,
    private readonly web3: Web3,
    private readonly tokenService: TokenService,
  ) {}

  public async web3Auth(signature: string): Promise<AuthResult> {
    const address = await this.web3.eth.personal.ecRecover(
      this.signMessage,
      signature,
    );

    let authUser = await this.authUserPgRepository.findByAddress(address);

    if (!authUser) {
      authUser = AuthUser.createByAddress(address);
      await this.authUserPgRepository.save(authUser);
    }

    const token = await this.tokenService.generate(authUser);

    return { token };
  }
}
