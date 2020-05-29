import { Instructions, initBinaryTree, BinaryTreeNode } from './helper';
import { StepInstruction } from 'types';
import { BST } from 'types/ds/BST';

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
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'search',
  );
  let instructions = new Instructions();

  let current = bst;
  let found = false;
  instructions.push({
    actions: [{ name: 'focus', params: [current?.key] }],
    ..._getExplanationAndCodeLine('init'),
  });

  while (current !== null && !found) {
    instructions.push({
      actions: [],
      ..._getExplanationAndCodeLine('compare'),
    });
    if (current.val === value) {
      // Found the element!
      instructions.push({
        actions: [],
        ..._getExplanationAndCodeLine('compareEqual'),
      });
      found = true;
    } else if (value < current.val) {
      // Go Left as data is smaller than parent
      instructions.push({
        actions: [
          {
            name: 'resetFocus',
            params: [],
          },
          {
            name: 'visit',
            params: [current.key, current.left && current.left.key],
          },
        ],
        ..._getExplanationAndCodeLine('compareSmaller'),
      });
      current = current.left;
    } else {
      // Go right as data is greater than parent
      instructions.push({
        actions: [
          {
            name: 'resetFocus',
            params: [],
          },
          {
            name: 'visit',
            params: [current.key, current.right && current.right.key],
          },
        ],
        ..._getExplanationAndCodeLine('compareGreater'),
      });
      current = current.right;
    }
  }

  // Not found the element
  if (!found) {
    instructions.push({
      actions: [
        {
          name: 'resetFocus',
          params: [],
        },
      ],
      ..._getExplanationAndCodeLine('notFound'),
    });
  }

  return instructions.get();
};

const insertInstruction = (
  data: BST.InputData,
  { value }: BST.InsertParams,
) => {
  const bst = initBinaryTree(data);
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'insert',
  );
  let instructions = new Instructions();

  let newNode = new BinaryTreeNode(value, data.length);
  instructions.push({
    actions: [],
    ..._getExplanationAndCodeLine('init'),
  });
  if (bst === null) {
    instructions.push({
      actions: [],
      ..._getExplanationAndCodeLine('rootNotFound'),
    });
  } else {
    instructions.push({
      actions: [{ name: 'focus', params: [bst.key] }],
      ..._getExplanationAndCodeLine('startRecursion'),
    });
    insertHelper(bst, newNode);
  }

  function insertHelper(currentNode: BinaryTreeNode, newNode: BinaryTreeNode) {
    if (newNode.val < currentNode.val) {
      if (currentNode.left === null) {
        instructions.push({
          actions: [{ name: 'insert', params: [currentNode.key, newNode.val] }],
          ..._getExplanationAndCodeLine('recursionLeft'),
        });
        currentNode.left = newNode;
      } else {
        instructions.push({
          actions: [
            { name: 'visit', params: [currentNode.key, currentNode.left.key] },
          ],
          ..._getExplanationAndCodeLine('recursionLeft'),
        });
        insertHelper(currentNode.left, newNode);
      }
    } else {
      if (currentNode.right === null) {
        instructions.push({
          actions: [{ name: 'insert', params: [currentNode.key, newNode.val] }],
          ..._getExplanationAndCodeLine('recursionRight'),
        });
        currentNode.right = newNode;
      } else {
        instructions.push({
          actions: [
            { name: 'visit', params: [currentNode.key, currentNode.right.key] },
          ],
          ..._getExplanationAndCodeLine('recursionRight'),
        });
        insertHelper(currentNode.right, newNode);
      }
    }
  }

  instructions.push({
    actions: [{ name: 'resetAll', params: [] }],
  });

  return instructions.get();
};

const deleteInstruction = (
  data: BST.InputData,
  { value }: BST.DeleteParams,
) => {
  const bst = initBinaryTree(data);
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'delete',
  );
  let instructions = new Instructions();

  let current = bst;
  let found = false;
  instructions.push({
    actions: [{ name: 'focus', params: [current?.key] }],
    ..._getExplanationAndCodeLine('find'),
  });
  while (current !== null && !found) {
    if (current.val === value) {
      // Found the element!
      instructions.push({
        actions: [
          {
            name: 'label',
            params: ['Node to delete', current ? current.key : null],
          },
        ],
        ..._getExplanationAndCodeLine('find'),
      });
      found = true;
    } else if (value < current.val) {
      // Go Left as data is smaller than parent
      instructions.push({
        actions: [
          {
            name: 'resetFocus',
            params: [],
          },
          {
            name: 'visit',
            params: [current.key, current.left && current.left.key],
          },
        ],
        ..._getExplanationAndCodeLine('find'),
      });
      current = current.left;
    } else {
      // Go right as data is greater than parent
      instructions.push({
        actions: [
          {
            name: 'resetFocus',
            params: [],
          },
          {
            name: 'visit',
            params: [current.key, current.right && current.right.key],
          },
        ],
        ..._getExplanationAndCodeLine('find'),
      });
      current = current.right;
    }
  }

  if (found && current) {
    if (current.left === null && current.right === null) {
      // No child situation
      // Delete the node just found
      instructions.push({
        actions: [{ name: 'delete', params: [current ? current.key : null] }],
        ..._getExplanationAndCodeLine('noChild'),
      });
    } else if (current.left !== null && current.right !== null) {
      // Two child situation
      // Find the biggest node in the left sub-tree
      let predecessor = current.left;
      instructions.push({
        actions: [{ name: 'focus', params: [predecessor.key] }],
        ..._getExplanationAndCodeLine('bothChild'),
      });
      while (predecessor.right) {
        instructions.push({
          actions: [
            {
              name: 'resetFocus',
              params: [],
            },
            {
              name: 'focus',
              params: [current.key],
            },
            { name: 'visit', params: [predecessor.key, predecessor.right.key] },
          ],
          ..._getExplanationAndCodeLine('bothChild'),
        });
        predecessor = predecessor.right;
      }

      const { key, val } = predecessor;
      instructions.push({
        actions: [{ name: 'setValue', params: [val, current.key] }],
        ..._getExplanationAndCodeLine('bothChild'),
      });
      instructions.push({
        actions: [{ name: 'delete', params: [key] }],
        ..._getExplanationAndCodeLine('bothChild'),
      });
    } else {
      // One child situation
      // Copy value and delete child
      const onlyChildNode = current.left || current.right;
      const { key, val } = onlyChildNode!;
      instructions.push({
        actions: [{ name: 'setValue', params: [val, current.key] }],
        ..._getExplanationAndCodeLine('onlyChild'),
      });
      instructions.push({
        actions: [{ name: 'delete', params: [key] }],
        ..._getExplanationAndCodeLine('onlyChild'),
      });
    }

    instructions.push({
      actions: [{ name: 'resetAll', params: [] }],
    });
    return instructions.get();
  } else {
    // Can not find the node to delete
    instructions.push({
      actions: [{ name: 'resetAll', params: [] }],
      ..._getExplanationAndCodeLine('notFound'),
    });
    return instructions.get();
  }
};

const preorderTraversalInstruction = (data: BST.InputData) => {
  const bst = initBinaryTree(data);
  let instructions = new Instructions();
  let currentFocusKey: number | null = null;

  function preorderHelper(tree: BinaryTreeNode) {
    const { key, left, right, val } = tree;
    instructions.push({
      actions: [
        { name: 'resetFocus', params: [] },
        { name: 'focus', params: [key] },
        { name: 'visited', params: [currentFocusKey] },
      ],
      // ..._getExplanationAndCodeLine('notFound'),
    });
    currentFocusKey = key;

    if (left) preorderHelper(left);
    if (right) preorderHelper(right);
  }

  preorderHelper(bst!);

  instructions.push({
    actions: [
      { name: 'resetFocus', params: [] },
      { name: 'visited', params: [currentFocusKey] },
    ],
    // ..._getExplanationAndCodeLine('notFound'),
  });
  instructions.push({
    actions: [{ name: 'resetAll', params: [] }],
    // ..._getExplanationAndCodeLine('notFound'),
  });

  return instructions.get();
};

const inorderTraversalInstruction = (data: BST.InputData) => {
  const bst = initBinaryTree(data);
  let instructions = new Instructions();
  let currentFocusKey: number | null = null;

  function inorderHelper(tree: BinaryTreeNode) {
    const { key, left, right, val } = tree;
    if (left) inorderHelper(left);

    instructions.push({
      actions: [
        { name: 'resetFocus', params: [] },
        { name: 'focus', params: [key] },
        { name: 'visited', params: [currentFocusKey] },
      ],
      // ..._getExplanationAndCodeLine('notFound'),
    });
    currentFocusKey = key;

    if (right) inorderHelper(right);
  }

  inorderHelper(bst!);

  instructions.push({
    actions: [
      { name: 'resetFocus', params: [] },
      { name: 'visited', params: [currentFocusKey] },
    ],
    // ..._getExplanationAndCodeLine('notFound'),
  });
  instructions.push({
    actions: [{ name: 'resetAll', params: [] }],
    // ..._getExplanationAndCodeLine('notFound'),
  });

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

    instructions.push({
      actions: [
        { name: 'resetFocus', params: [] },
        { name: 'focus', params: [key] },
        { name: 'visited', params: [currentFocusKey] },
      ],
      // ..._getExplanationAndCodeLine('notFound'),
    });
    currentFocusKey = key;
  }

  postorderHelper(bst!);

  instructions.push({
    actions: [
      { name: 'resetFocus', params: [] },
      { name: 'visited', params: [currentFocusKey] },
    ],
    // ..._getExplanationAndCodeLine('notFound'),
  });
  instructions.push({
    actions: [{ name: 'resetAll', params: [] }],
    // ..._getExplanationAndCodeLine('notFound'),
  });

  return instructions.get();
};

const getExplanationAndCodeLine = (
  operation: BST.Api,
  subOperation: string,
): Pick<StepInstruction, 'codeLine' | 'explanationStep'> => {
  switch (operation) {
    case 'search':
      switch (subOperation) {
        case 'init':
          return { codeLine: '2', explanationStep: 1 };
        case 'compare':
          return { codeLine: '3', explanationStep: 2 };
        case 'compareEqual':
          return { codeLine: '4-6', explanationStep: 3 };
        case 'compareSmaller':
          return { codeLine: '7-9', explanationStep: 4 };
        case 'compareGreater':
          return { codeLine: '11-12', explanationStep: 5 };
        case 'notFound':
          return { codeLine: '16-17', explanationStep: 6 };
        default:
          return {};
      }

    case 'insert': {
      switch (subOperation) {
        case 'init':
          return { codeLine: '2', explanationStep: 1 };
        case 'rootNotExist':
          return { codeLine: '3-4', explanationStep: 2 };
        case 'startRecursion':
          return { codeLine: '6', explanationStep: 3 };
        case 'recursionLeft':
          return { codeLine: '12-16', explanationStep: 4 };
        case 'recursionRight':
          return { codeLine: '18-23', explanationStep: 5 };
        default:
          return {};
      }
    }

    case 'delete': {
      switch (subOperation) {
        case 'find':
          return { codeLine: '2-3', explanationStep: 1 };
        case 'noChild':
          return { codeLine: '8-9', explanationStep: 2 };
        case 'onlyChild':
          return { codeLine: '11-15', explanationStep: 3 };
        case 'bothChild':
          return { codeLine: '17-21', explanationStep: 4 };
        case 'notFound':
          return { codeLine: '5-6', explanationStep: 2 };
        default:
          return {};
      }
    }

    default:
      return {};
  }
};
