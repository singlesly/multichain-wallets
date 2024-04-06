import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { toHex } from '@app/utils';
import { FunctionArgumentTypes } from 'tronweb';

const AbiCoder = ethers.AbiCoder;
const ADDRESS_PREFIX_REGEX = /^(41)/;
const ADDRESS_PREFIX = '41';

@Injectable()
export class ParameterService {
  public async encode(
    inputs: { type: string; value: string | number | string[] | number[] }[],
  ): Promise<string> {
    const typesValues = inputs;
    let parameters = '';

    if (typesValues.length == 0) return parameters;
    const abiCoder = new AbiCoder();
    const types = [];
    const values = [];

    for (let i = 0; i < typesValues.length; i++) {
      const { type } = typesValues[i];
      let { value } = typesValues[i];
      if (type == 'address') {
        value = (value as string).replace(ADDRESS_PREFIX_REGEX, '0x');
      } else if (type == 'address[]' && Array.isArray(value)) {
        value = value.map((v) => toHex(v).replace(ADDRESS_PREFIX_REGEX, '0x'));
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      types.push(type);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      values.push(value);
    }

    console.log(types, values);
    try {
      parameters = abiCoder.encode(types, values).replace(/^(0x)/, '');
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
    return parameters;
  }

  public async decode<R>(
    types: FunctionArgumentTypes[],
    output: string,
    ignoreMethodHash: any = true,
  ): Promise<R> {
    if (!output || typeof output === 'boolean') {
      ignoreMethodHash = output;
      (output as unknown) = types;
    }

    if (ignoreMethodHash && output.replace(/^0x/, '').length % 64 === 8)
      output = '0x' + output.replace(/^0x/, '').substring(8);

    const abiCoder = new AbiCoder();

    if (output.replace(/^0x/, '').length % 64)
      throw new Error(
        'The encoded string is not valid. Its length must be a multiple of 64.',
      );
    return abiCoder.decode(types, output).reduce((obj, arg, index) => {
      if (types[index] == 'address')
        arg = ADDRESS_PREFIX + arg.substr(2).toLowerCase();
      obj.push(arg);
      return obj;
    }, []);
  }
}
