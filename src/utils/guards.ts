import { isNull } from '@fullstacksjs/toolbox';

export function assertNotIncludeNulls<T>(arg: T[]): asserts arg is NonNullable<T>[] {
  if (arg.some(isNull)) throw Error('User not found');
}
