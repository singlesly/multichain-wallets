import { ForbiddenException, Injectable } from '@nestjs/common';
import * as solc from 'solc';
import { EthereumWeb3Service } from '@app/ethereum/services/ethereum-web3.service';

@Injectable()
export class DeploySmartContractService {
  constructor() {}

  public async deploy(
    web3: EthereumWeb3Service,
    ownerPrivateKey: string,
    options: { content: string; args: string[] },
  ): Promise<{ address: string }> {
    const input = {
      language: 'Solidity',
      sources: {
        'contract.sol': {
          content: options.content,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    const compiledContract = Object.values(output.contracts['contract.sol'])[0];

    if (!compiledContract) {
      throw new ForbiddenException('Contract error loading not found');
    }

    // console.log(contract);

    const abi = compiledContract['abi'];
    const bytecode = compiledContract['evm'].bytecode.object;

    const account = web3.eth.accounts.privateKeyToAccount(ownerPrivateKey);
    web3.eth.accounts.wallet.add(account);

    const contract = new web3.eth.Contract(abi);
    const contractDeployer = contract.deploy({
      data: '0x' + bytecode,
      arguments: options.args,
    });
    const gas = await contractDeployer.estimateGas({ from: account.address });
    try {
      const tx = await contractDeployer.send({
        from: account.address,
        gas: gas.toString(10),
        gasPrice: String(await web3.eth.getGasPrice()),
      });

      return {
        address: tx.options.address || '',
      };
    } catch (e) {
      console.error('cannot deploy contract');
      console.error(e);
      throw e;
    }
  }
}
