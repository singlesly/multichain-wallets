import { Injectable } from '@nestjs/common';
import ethers from 'ethers';
import { toHex } from '../../utils';

const AbiCoder = ethers.utils.AbiCoder;
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
      types.push(type);
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
}
