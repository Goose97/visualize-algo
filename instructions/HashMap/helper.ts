

export class HashMapNode {
  val: number;
  key: number;
  constructor(val: number, key: number) {
    this.val = val;
    this.key = key;
  }
}

export const initHashMap = (hashMap: number[]): HashMapNode[] => {
  return hashMap.map((value, index) => new HashMapNode(value, index));
};