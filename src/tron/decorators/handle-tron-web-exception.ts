import { TronNetworkExceptionFactory } from '@app/common/exceptions/tron-network-exception.factory';

export function HandleTronWebException(): MethodDecorator {
  const tronExceptionFactory = new TronNetworkExceptionFactory();

  return function (
    target,
    propertyKey,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> {
    const method = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const m = method.apply(this, args);
      if ('catch' in m) {
        return m.catch((e) => {
          throw tronExceptionFactory.toThrow(e);
        });
      }
      return m;
    };

    return descriptor;
  };
}
