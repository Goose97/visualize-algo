import { IProps } from './index.d';
import { HashTable } from 'types/ds/HashTable';
import { HASH_TABLE_UNIVERSAL_KEY_SIZE } from '../../constants';

export const caculateKeyHash = (key: string, universalKeySize: number) => {
  const sum = key
    .split('')
    .reduce((acc, letter) => acc + letter.charCodeAt(0), 0);
  return sum % universalKeySize;
};

export const initLinearProbeHashTableData = (data: IProps['initialData']) => {
  let keys: HashTable.Key[] = [];
  let memoryAddresses: HashTable.MemoryAddress[] = [];
  const findAvailableSlot = (key: string) => {
    let hashAddress = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
    while (true) {
      const memoryAddress = memoryAddresses.find(
        ({ key }) => key === hashAddress,
      );
      if (!memoryAddress) return hashAddress;
      hashAddress++;
    }
  };

  const insertKey = (key: string, value: string | number, address: number) => {
    keys.push({
      key,
      value,
      address,
    });
  };

  const insertMemoryAddress = (value: string | number, address: number) => {
    memoryAddresses.push({
      key: address,
      values: [value],
    });
  };

  Object.entries(data).forEach(([key, value]) => {
    const addressToFill = findAvailableSlot(key);
    insertKey(key, value, addressToFill);
    insertMemoryAddress(value, addressToFill);
  });

  return {
    keys,
    memoryAddresses,
  };
};
