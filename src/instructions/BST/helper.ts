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

export class BinarySearchTree {
  private root: BinaryTreeNode | null;
  private key: number;
  constructor() {
    this.root = null;
    this.key = 0;
  }

  // Insert a value as a node in the BST
  insert(value: string | number) {
    let newNode = new BinaryTreeNode(value, this.key++);

    // If root empty, set new node as the root
    if (!this.root) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  // helper function
  insertNode(root: BinaryTreeNode, newNode: BinaryTreeNode) {
    if (newNode.val < root.val) {
      // If no left child, then just insesrt to the left
      if (!root.left) {
        root.left = newNode;
      } else {
        this.insertNode(root.left, newNode);
      }
    } else {
      // If no right child, then just insesrt to the right
      if (!root.right) {
        root.right = newNode;
      } else {
        this.insertNode(root.right, newNode);
      }
    }
  }

  // Remove a node with the value passed
  remove(value: number | string) {
    if (!this.root) {
      return 'Tree is empty!';
    } else {
      this.removeNode(this.root, value);
    }
  }

  // helper function
  removeNode(root: BinaryTreeNode | null, value: number | string) {
    if (!root) {
      return null;
    }

    // If value is less than root value, go to the left subtree
    if (value < root.val) {
      root.left = this.removeNode(root.left, value);
      return root;
      // If value is greater than root value, go to the right subtree
    } else if (value > root.val) {
      root.right = this.removeNode(root.right, value);
      return root;
      // If we found the value, remove the node
    } else {
      // If no child nodes, just remove the node
      if (!root.left && !root.right) {
        root = null;
        return root;
      }

      // If one child (left)
      if (root.left) {
        root = root.left;
        return root;
        // If one child (right)
      } else if (root.right) {
        root = root.right;
        return root;
      }

      // If two child nodes (both)
      // Get the minimum of the right subtree to ensure we have valid replacement
      let minRight = this.findMinNode(root.right!);
      root.val = minRight.val;

      // Make sure we remove the node that we replaced the deleted node
      root.right = this.removeNode(root.right, minRight.val);
      return root;
    }
  }

  findMinNode(root: BinaryTreeNode): BinaryTreeNode {
    if (!root || !root.left) {
      return root;
    } else {
      return this.findMinNode(root.left);
    }
  }

  // Return boolean value depending on the existence of the value in the tree
  search(value: number | string) {
    if (!this.root) {
      return 'Tree is empty';
    } else {
      return Boolean(this.searchNode(this.root, value));
    }
  }

  searchNode(
    root: BinaryTreeNode | null,
    value: string | number,
  ): BinaryTreeNode | null {
    if (!root) {
      return null;
    }

    if (value < root.val) {
      return this.searchNode(root.left, value);
    } else if (value > root.val) {
      return this.searchNode(root.right, value);
    }

    return root;
  }

  //-----3----
  //----------
  //--1----4--  ------->>>> [3, 1, 4, 0, 2, null, 6]
  //----------
  //0--2-----6
  getLayerRepresentation(): Array<string | number | null> {
    // Do a level traversal
    let queue: Array<BinaryTreeNode | null> = [this.root];
    let result: Array<string | number | null> = [];
    while (queue.length) {
      let currentNode = queue.shift()!;
      result.push(currentNode ? currentNode.val : currentNode);
      if (currentNode) {
        queue.push(currentNode.left);
        queue.push(currentNode.right);
      }
    }

    // Trim the trailing nulls
    let lastValueIndex;
    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i] !== null) {
        lastValueIndex = i;
        break;
      }
    }

    return lastValueIndex !== undefined
      ? result.slice(0, lastValueIndex + 1)
      : [];
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

// Insert one by one
export const initBSTbySequentiallyInsert = (
  array: Array<number | string | null>,
) => {
  let bst = new BinarySearchTree();
  array.filter(item => item).forEach(item => bst.insert(item!));
  return bst;
};
