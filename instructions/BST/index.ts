import { Instructions, initBinaryTree } from './helper';
import { BSTOperation, SearchParams } from './index.d';
import { StepInstruction } from 'types';

export const bstInstruction = (
  data: number[],
  operation: BSTOperation,
  parameters: any,
) => {
  switch (operation) {
    case 'search':
      return searchInstruction(data, parameters);

    default:
      return [];
  }
};

const searchInstruction = (
  data: number[] | string[],
  { value }: SearchParams,
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

const getExplanationAndCodeLine = (
  operation: BSTOperation,
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

export const code = {
  search: searchCode,
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
};
