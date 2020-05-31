

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

// export const convertLinkedListToArray = (linkedList: LinkedListNode) => {
//   let result = [];
//   let current: LinkedListNode | null = linkedList;
//   while (current) {
//     result.push(current.val);
//     current = current.next;
//   }

//   return result;
// };
