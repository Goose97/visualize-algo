

export class ArrayNode {
  val: number;
  key: number;
  constructor(val: number, key: number) {
    this.val = val;
    this.key = key;
  }
}

export const initArray = (array: number[]): ArrayNode[] => {
  return array.map((value, index) => new ArrayNode(value, index));
};