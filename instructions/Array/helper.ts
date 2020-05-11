import { StepInstruction } from 'types';

const DEFAULT_DURATION = 1500;

export class Instructions {
  private instructions: StepInstruction[];
  constructor() {
    this.instructions = [];
  }

  push(instruction: StepInstruction) {
    const newInstruction: StepInstruction = Object.assign(
      { duration: DEFAULT_DURATION },
      instruction
    );
    this.instructions.push(newInstruction);
  }

  get() {
    return this.instructions;
  }
}

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
