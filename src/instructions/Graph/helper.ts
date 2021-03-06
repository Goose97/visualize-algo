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
      instruction,
    );
    this.instructions.push(newInstruction);
  }

  get() {
    return this.instructions;
  }
}

export class LinkedListNode {
  val: number;
  next: LinkedListNode | null;
  key: number;
  constructor(val: number, key: number) {
    this.val = val;
    this.next = null;
    this.key = key;
  }
}

export const initLinkedList = (array: number[]): LinkedListNode => {
  let head: LinkedListNode;
  let current;
  for (let i = 0; i < array.length; i++) {
    const newNode = new LinkedListNode(array[i], i);
    if (current) {
      current.next = newNode;
      current = current.next;
    } else {
      // first node
      head = newNode;
      current = head;
    }
  }

  //@ts-ignore
  return head;
};

export const convertLinkedListToArray = (linkedList: LinkedListNode) => {
  let result = [];
  let current: LinkedListNode | null = linkedList;
  while (current) {
    result.push(current.val);
    current = current.next;
  }

  return result;
};
