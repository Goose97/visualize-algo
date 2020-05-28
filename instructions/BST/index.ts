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

const searchCode = `function search(data) {
  let current = this.root;
  while (current !== null) {
    if (current.data === data) {
      // Found the element!
      return current;
    } else if (data < current.data) {
      // Go Left as data is smaller than parent
      current = current.left;
    } else {
      // Go right as data is greater than parent
      current = current.right;
    }
  }

  // Not found the element
  return null;
}`;

const insertCode = `function insert(value) {
  let newNode = new BinarySearchTreeNode(value); // { val: value, left: null, right: null }
  if (this.root === null) {
    this.root = newNode;
  } else {
    this.insertHelper(this.root, newNode);
  }
}

function insertHelper(currentNode, newNode) {
  // If the value is less than the current node value move left of the tree
  if (newNode.data < currentNode.data) {
    // If left is null insert node here
    if (currentNode.left === null) currentNode.left = newNode;
    // If left is not null recurr until null is found
    else insertHelper(currentNode.left, newNode);
  }
  // If the value is greater than the current node value move right of the tree
  else {
    // if right is null insert node here
    if (currentNode.right === null) currentNode.right = newNode;
    // if right is not null recurr until null is found
    else insertHelper(currentNode.right, newNode);
  }
}`;

const deleteCode = `function delete(value) {
  // Find node to delete
  let nodeToDelete = this.search(value);

  // If can't find node to delete, return root
  if (!nodeToDelete) return this.root;

  // If node has no child, just delete it
  // parent.left = null or parent.right = null

  // If node has one children, copy value of child then delete the child
  let onlyChild = nodeToDelete.left || nodeToDelete.right;
  nodeToDelete.val = onlyChild.val;
  if (nodeToDelete.left) nodeToDelete.left = null;
  else nodeToDelete.right = null;

  // If node has two children, find its predecessor (biggest node in the left subtree)
  // Copy its value then delete it
  let [predecessor, parentOfPredecessor] = this.findPredecessor(nodeToDelete);
  nodeToDelete.val = predecessor.delete;
  parentOfPredecessor.right = null;
}`;

export const code = {
  search: searchCode,
  insert: insertCode,
  delete: deleteCode,
};

export const explanation = {
  search: [
    'Khởi tạo biến lưu node hiện tại với giá trị ban đầu là root của binary search tree',
    'So sánh giá trị đang tìm kiếm với giá trị của node hiện tại',
    'Nếu bằng thì trả về node hiện tại',
    'Nếu nhỏ hơn thì đặt current = current.left (tiếp tục tìm kiếm ở bên trái)',
    'Nếu lớn hơn thì đặt current = current.right (tiếp tục tìm kiếm ở bên phải)',
    'Nếu kết thúc vòng loop mà vẫn chưa tìm thấy value thì trả về null',
  ],
  insert: [
    'Khởi tạo node mới và lưu vào biến newNode',
    'Nếu root chưa tồn tại thì đặt root là node mới tạo',
    'Nếu không thì đệ quy bắt đầu từ root để tìm vị trí insert',
    'Nếu giá trị cần insert nhỏ hơn giá node hiện tại thì insert nếu còn chỗ (currentNode.left === null), nếu không tiếp tục đệ quy với node con bên trái',
    'Nếu giá trị cần insert lớn hơn giá node hiện tại thì insert nếu còn chỗ (currentNode.right === null), nếu không tiếp tục đệ quy với node con bên phải',
  ],
  delete: [
    'Tìm kiếm node cần xoá',
    'Nếu node cần xoá không có children (là leaf node) thì chỉ cần xoá node đó đi',
    'Nếu node cần xoá có 1 children sao chép giá trị của child sang node cần xoá rồi xoá child đi',
    'Nếu node cần xoá có 2 children thì tìm node lớn nhất ở nhánh trái hoặc node nhỏ nhất của nhánh phải, sao chép giá trị sang node cần xoá rồi xoá node ấy',
  ],
};
