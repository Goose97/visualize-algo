import { ObjectType } from 'types';
import { caculateKeyHash } from 'components/HashTable/helper';
import { HASH_TABLE_UNIVERSAL_KEY_SIZE } from '../../constants';

export class HashTableNode {
  val: number;
  key: number;
  constructor(val: number, key: number) {
    this.val = val;
    this.key = key;
  }
}

export const initHashTable = (HashTable: number[]): HashTableNode[] => {
  return HashTable.map((value, index) => new HashTableNode(value, index));
};

type AddressValuesMap = ObjectType<Array<number | string>>;
export const produceAddressValuesMap = (hashTable: AddressValuesMap) => {
  return Object.entries(hashTable).reduce<AddressValuesMap>(
    (acc, [key, value]) => {
      const hashedAddress = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
      const oldValue = acc[hashedAddress] || [];
      return { ...acc, [hashedAddress]: oldValue.concat(value) };
    },
    {},
  );
};
