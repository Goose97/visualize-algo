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
