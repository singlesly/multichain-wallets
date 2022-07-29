import { AuthUserPgRepository } from '@app/auth/repositories/auth-user-pg.repository';
import { Injectable } from '@nestjs/common';
import { AuthResult } from '@app/auth/services/auth.service';
import { AuthUser } from '@app/auth/dao/entity/auth-user';
import { TokenService } from '@app/token/token.service';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';
import web3 from 'web3';

@Injectable()
export class Web3AuthService {
  private readonly signMessage = 'Authentication';

  constructor(
    private readonly authUserPgRepository: AuthUserPgRepository,
    private readonly web3: EthereumWeb3Service,
    private readonly tokenService: TokenService,
  ) {}

  public async web3Auth(signature: string): Promise<AuthResult> {
    const address = this.web3.eth.accounts
      .recover(web3.utils.toHex(this.signMessage), signature)
      .toLowerCase();

    let authUser = await this.authUserPgRepository.findByAddress(address);

    if (!authUser) {
      authUser = AuthUser.createByAddress(address);
      await this.authUserPgRepository.save(authUser);
    }

    const token = await this.tokenService.generate(authUser);

    return { token };
  }
}
