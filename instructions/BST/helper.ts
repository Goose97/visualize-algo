import { StepInstruction } from 'types';
import { BSTInputData } from './index.d'

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

export class BinaryTreeNode {
  val: number | string;
  key: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
  constructor(val: number | string, key: number) {
    this.val = val;
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

export function initBinaryTree(array: Array<number | string | null>) {
  let head = null;
  let queue = [];
  let counter = 0;
  if (!array.length) return null;
  for (let i = 0; i < array.length; i++) {
    let val = array[i];
    const newNode = val !== null ? new BinaryTreeNode(val, i) : null;
    if (head) {
      let parentNode = queue[0]!;
      if (counter === 0) {
        // this node is left of parent node
        parentNode.left = newNode;
        counter++;
      } else {
        // this node is right of parent node
        parentNode.right = newNode;
        counter = 0;
        queue.shift();
      }
    } else {
      head = newNode;
    }

    queue.push(newNode);
  }

  return head;
}