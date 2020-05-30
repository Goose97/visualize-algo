import { initBinaryTree, BinaryTreeNode } from './helper';
import { StepInstruction, ObjectType } from 'types';
import { BST } from 'types/ds/BST';
import { Instructions } from 'instructions';

export const bstInstruction = (
  data: number[],
  operation: BST.Api,
  parameters: any,
) => {
  switch (operation) {
    case 'search':
      return searchInstruction(data, parameters);

    case 'insert':
      return insertInstruction(data, parameters);

    case 'delete':
      return deleteInstruction(data, parameters);

    case 'preorder':
      return preorderTraversalInstruction(data);

    case 'inorder':
      return inorderTraversalInstruction(data);

    case 'postorder':
      return postorderTraversalInstruction(data);

    default:
      return [];
  }
};

const searchInstruction = (
  data: BST.InputData,
  { value }: BST.SearchParams,
) => {
  const bst = initBinaryTree(data);
  let instructions = new Instructions();
  const codeLines = getCodeLine('search');

  let current = bst;
  let found = false;

  instructions.setCodeLine(codeLines.init);
  instructions.pushActionsAndEndStep('bst', [
    { name: 'focus', params: [current?.key] },
  ]);

  while (current !== null && !found) {
    instructions.setCodeLine(codeLines.compare);
    instructions.pushActionsAndEndStep('bst', []);

    if (current.val === value) {
      // Found the element!
      instructions.setCodeLine(codeLines.compareEqual);
      instructions.pushActionsAndEndStep('bst', [
        {
          name: 'visited',
          params: [current.key],
        },
      ]);

      found = true;
    } else if (value < current.val) {
      // Go Left as data is smaller than parent
      instructions.setCodeLine(codeLines.compareSmaller);
      instructions.pushActionsAndEndStep('bst', [
        {
          name: 'resetFocus',
          params: [],
        },
        {
          name: 'visit',
          params: [current.key, current.left && current.left.key],
        },
      ]);

      current = current.left;
    } else {
      // Go right as data is greater than parent
      instructions.setCodeLine(codeLines.compareGreater);
      instructions.pushActionsAndEndStep('bst', [
        {
          name: 'resetFocus',
          params: [],
        },
        {
          name: 'visit',
          params: [current.key, current.right && current.right.key],
        },
      ]);

      current = current.right;
    }
  }

  // Not found the element
  if (!found) {
    instructions.setCodeLine(codeLines.notFound);
  }

  instructions.pushActionsAndEndStep('bst', [
    {
      name: 'resetAll',
      params: [],
    },
  ]);

  return instructions.get();
};

const insertInstruction = (
  data: BST.InputData,
  { value }: BST.InsertParams,
) => {
  const bst = initBinaryTree(data);
  let instructions = new Instructions();
  const codeLines = getCodeLine('insert');

  let newNode = new BinaryTreeNode(value, data.length);

  instructions.setCodeLine(codeLines.init);
  instructions.pushActionsAndEndStep('bst', []);
  if (bst === null) {
    instructions.setCodeLine(codeLines.rootNotFound);
    instructions.pushActionsAndEndStep('bst', []);
  } else {
    instructions.setCodeLine(codeLines.startRecursion);
    instructions.pushActionsAndEndStep('bst', [
      { name: 'focus', params: [bst.key] },
    ]);

    insertHelper(bst, newNode);
  }

  function insertHelper(currentNode: BinaryTreeNode, newNode: BinaryTreeNode) {
    if (newNode.val < currentNode.val) {
      if (currentNode.left === null) {
        instructions.setCodeLine(codeLines.recursionLeft);
        instructions.pushActionsAndEndStep('bst', [
          { name: 'insert', params: [currentNode.key, newNode.val] },
        ]);

        currentNode.left = newNode;
      } else {
        instructions.setCodeLine(codeLines.recursionLeft);
        instructions.pushActionsAndEndStep('bst', [
          { name: 'visit', params: [currentNode.key, currentNode.left.key] },
        ]);

        insertHelper(currentNode.left, newNode);
      }
    } else {
      if (currentNode.right === null) {
        instructions.setCodeLine(codeLines.recursionRight);
        instructions.pushActionsAndEndStep('bst', [
          { name: 'insert', params: [currentNode.key, newNode.val] },
        ]);

        currentNode.right = newNode;
      } else {
        instructions.setCodeLine(codeLines.recursionRight);
        instructions.pushActionsAndEndStep('bst', [
          { name: 'visit', params: [currentNode.key, currentNode.right.key] },
        ]);

        insertHelper(currentNode.right, newNode);
      }
    }
  }

  instructions.pushActionsAndEndStep('bst', [{ name: 'resetAll', params: [] }]);

  return instructions.get();
};

const deleteInstruction = (
  data: BST.InputData,
  { value }: BST.DeleteParams,
) => {
  const bst = initBinaryTree(data);
  let instructions = new Instructions();
  const codeLines = getCodeLine('delete');

  let current = bst;
  let found = false;

  instructions.setCodeLine(codeLines.find);
  instructions.pushActionsAndEndStep('bst', [
    { name: 'focus', params: [current?.key] },
  ]);

  while (current !== null && !found) {
    if (current.val === value) {
      // Found the element!
      instructions.setCodeLine(codeLines.find);
      instructions.pushActionsAndEndStep('bst', [
        {
          name: 'label',
          params: ['Node to delete', current ? current.key : null],
        },
      ]);

      found = true;
    } else if (value < current.val) {
      // Go Left as data is smaller than parent
      instructions.setCodeLine(codeLines.find);
      instructions.pushActionsAndEndStep('bst', [
        {
          name: 'resetFocus',
          params: [],
        },
        {
          name: 'visit',
          params: [current.key, current.left && current.left.key],
        },
      ]);

      current = current.left;
    } else {
      // Go right as data is greater than parent
      instructions.setCodeLine(codeLines.find);
      instructions.pushActionsAndEndStep('bst', [
        {
          name: 'resetFocus',
          params: [],
        },
        {
          name: 'visit',
          params: [current.key, current.right && current.right.key],
        },
      ]);

      current = current.right;
    }
  }

  if (found && current) {
    if (current.left === null && current.right === null) {
      // No child situation
      // Delete the node just found
      instructions.setCodeLine(codeLines.noChild);
      instructions.pushActionsAndEndStep('bst', [
        { name: 'delete', params: [current ? current.key : null] },
      ]);
    } else if (current.left !== null && current.right !== null) {
      // Two child situation
      // Find the biggest node in the left sub-tree
      let predecessor = current.left;

      instructions.setCodeLine(codeLines.bothChild);
      instructions.pushActionsAndEndStep('bst', [
        { name: 'focus', params: [predecessor.key] },
      ]);

      while (predecessor.right) {
        instructions.setCodeLine(codeLines.bothChild);
        instructions.pushActionsAndEndStep('bst', [
          {
            name: 'resetFocus',
            params: [],
          },
          {
            name: 'focus',
            params: [current.key],
          },
          { name: 'visit', params: [predecessor.key, predecessor.right.key] },
        ]);

        predecessor = predecessor.right;
      }

      const { key, val } = predecessor;

      instructions.setCodeLine(codeLines.bothChild);
      instructions.pushActionsAndEndStep('bst', [
        { name: 'setValue', params: [val, current.key] },
      ]);

      instructions.setCodeLine(codeLines.bothChild);
      instructions.pushActionsAndEndStep('bst', [
        { name: 'delete', params: [key] },
      ]);
    } else {
      // One child situation
      // Copy value and delete child
      const onlyChildNode = current.left || current.right;
      const { key, val } = onlyChildNode!;

      instructions.setCodeLine(codeLines.onlyChild);
      instructions.pushActionsAndEndStep('bst', [
        { name: 'setValue', params: [val, current.key] },
      ]);

      instructions.setCodeLine(codeLines.onlyChild);
      instructions.pushActionsAndEndStep('bst', [
        { name: 'delete', params: [key] },
      ]);
    }

    instructions.pushActionsAndEndStep('bst', [
      { name: 'resetAll', params: [] },
    ]);

    return instructions.get();
  } else {
    // Can not find the node to delete
    instructions.setCodeLine(codeLines.notFound);
    instructions.pushActionsAndEndStep('bst', [
      { name: 'resetAll', params: [] },
    ]);

    return instructions.get();
  }
};

const preorderTraversalInstruction = (data: BST.InputData) => {
  const bst = initBinaryTree(data);
  let instructions = new Instructions();
  let currentFocusKey: number | null = null;

  function preorderHelper(tree: BinaryTreeNode) {
    const { key, left, right, val } = tree;
    instructions.pushActions('array', [
      { name: 'push', params: [val] },
    ]);
    instructions.pushActions('bst', [
      { name: 'resetFocus', params: [] },
      { name: 'focus', params: [key] },
      { name: 'visited', params: [currentFocusKey] },
    ]);
    instructions.endStep();

    currentFocusKey = key;

    if (left) preorderHelper(left);
    if (right) preorderHelper(right);
  }

  preorderHelper(bst!);

  instructions.pushActionsAndEndStep('bst', [
    { name: 'resetFocus', params: [] },
    { name: 'visited', params: [currentFocusKey] },
  ]);
  instructions.pushActionsAndEndStep('bst', [{ name: 'resetAll', params: [] }]);

  return instructions.get();
};

const inorderTraversalInstruction = (data: BST.InputData) => {
  const bst = initBinaryTree(data);
  let instructions = new Instructions();
  let currentFocusKey: number | null = null;

  function inorderHelper(tree: BinaryTreeNode) {
    const { key, left, right, val } = tree;
    if (left) inorderHelper(left);

    instructions.pushActionsAndEndStep('bst', [
      { name: 'resetFocus', params: [] },
      { name: 'focus', params: [key] },
      { name: 'visited', params: [currentFocusKey] },
    ]);

    currentFocusKey = key;

    if (right) inorderHelper(right);
  }

  inorderHelper(bst!);

  instructions.pushActionsAndEndStep('bst', [
    { name: 'resetFocus', params: [] },
    { name: 'visited', params: [currentFocusKey] },
  ]);

  instructions.pushActionsAndEndStep('bst', [{ name: 'resetAll', params: [] }]);

  return instructions.get();
};

const postorderTraversalInstruction = (data: BST.InputData) => {
  const bst = initBinaryTree(data);
  let instructions = new Instructions();
  let currentFocusKey: number | null = null;

  function postorderHelper(tree: BinaryTreeNode) {
    const { key, left, right, val } = tree;
    if (left) postorderHelper(left);
    if (right) postorderHelper(right);

    instructions.pushActionsAndEndStep('bst', [
      { name: 'resetFocus', params: [] },
      { name: 'focus', params: [key] },
      { name: 'visited', params: [currentFocusKey] },
    ]);

    currentFocusKey = key;
  }

  postorderHelper(bst!);

  instructions.pushActionsAndEndStep('bst', [
    { name: 'resetFocus', params: [] },
    { name: 'visited', params: [currentFocusKey] },
  ]);

  instructions.pushActionsAndEndStep('bst', [{ name: 'resetAll', params: [] }]);

  return instructions.get();
};

const getCodeLine = (operation: BST.Api): ObjectType<string> => {
  switch (operation) {
    case 'search':
      return {
        init: '2',
        compare: '3',
        compareEqual: '4-6',
        compareSmaller: '7-9',
        compareGreater: '11-12',
        notFound: '16-17',
      };

    case 'insert':
      return {
        init: '2',
        rootNotExist: '3-4',
        startRecursion: '6',
        recursionLeft: '12-16',
        recursionRight: '18-23',
      };

    case 'delete':
      return {
        find: '2-3',
        noChild: '8-9',
        onlyChild: '11-15',
        bothChild: '17-21',
        notFound: '5-6',
      };

    default:
      return {};
  }
};
