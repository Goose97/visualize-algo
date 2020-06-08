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
  let key = 0;
  if (!array.length) return null;
  for (let i = 0; i < array.length; i++) {
    let val = array[i];

    const newNode = val !== null ? new BinaryTreeNode(val, key++) : null;
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

export const findPredecessorOfNode = (node: BinaryTreeNode): BinaryTreeNode => {
  // The biggest node in the left sub-tree
  if (!node.left) return node;
  let currentNode = node.left;
  while (currentNode.right) {
    currentNode = currentNode.right;
  }

  return currentNode;
};

export const validateBinaryTree = (input: Array<string | number | null>) => {
  function helper(
    bst: BinaryTreeNode | null,
  ): [string | number | null, string | number | null, boolean] {
    if (bst === null) return [null, null, true];
    const [minLeft, maxLeft, isLeftValid] = helper(bst.left);
    const [minRight, maxRight, isRightValid] = helper(bst.right);

    if (!isLeftValid || !isRightValid) return [null, null, false];

    const isBiggerThanLeftSubtree = maxLeft === null || bst.val > maxLeft;
    const isSmallerThanRightSubtree = minRight === null || bst.val < minRight;
    const isValid = isBiggerThanLeftSubtree && isSmallerThanRightSubtree;
    const minOfThisSubTree = minLeft === null ? bst.val : minLeft;
    const maxOfThisSubTree = maxRight === null ? bst.val : maxRight;
    return [minOfThisSubTree, maxOfThisSubTree, isValid];
  }

  const bst = initBinaryTree(input);
  return helper(bst)[2];
};
