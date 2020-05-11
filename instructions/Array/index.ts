import { Instructions, initArray } from './helper';
import {

  ArrayOperation,
  SortParams
} from './index.d';
import { StepInstruction } from '../../types';

export const arrayInstruction = (
  data: number[],
  operation: ArrayOperation,
  parameters: any,
) => {
  switch (operation) {
    case 'bubbleSort':
      return bubbleSortInstruction(data, parameters);

    default:
      return [];
  }
};

const bubbleSortInstruction = (data: number[], params: SortParams) => {
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'bubbleSort',
  );
  let instructions = new Instructions();
  let array = initArray(data);
  console.log('array', array)
  
  instructions.push({
    actions: [{ name: 'focus', params: [0] }],
    ..._getExplanationAndCodeLine('init'),
  });
  console.log('hello')

  // Start make instruction
  let len = array.length;
  let i, j, stop;
  for (i = 0; i < len; i++){
    for (j = 0, stop = len - i -1; j < stop; j++){
      console.log('len', len)
      console.log('j+1', j+1)
      console.log('array[j+1]', array[j+1])
      if (array[j].val > array[j+1].val) {
        instructions.push({
          actions: [{ name: 'swap', params: [array[j].key, array[j + 1].key] }],
          ..._getExplanationAndCodeLine('swap'),
        });
        let temp = array[j];
        array[j] = array[j+1];
        array[j+1] = temp;
      }
    }
  }

  return instructions.get();
};

const getExplanationAndCodeLine = (
  operation: ArrayOperation,
  subOperation: string,
): Pick<StepInstruction, 'codeLine' | 'explanationStep'> => {
  switch (operation) {
    case 'bubbleSort':
      switch (subOperation) {
        case 'init':
          return { codeLine: '2-3', explanationStep: 1 };
        case 'compare':
          return { codeLine: '6', explanationStep: 2 };
        case 'compareSuccess':
          return { codeLine: '6', explanationStep: 3 };
        case 'swap':
          return { codeLine: '6', explanationStep: 3 };
        default:
          return {};
      }
  }
};

const searchCode = `function search(value) {
  let current = this.list;
  let index = 0;
  do {
    // Nếu tìm thấy thì return index
    if (current.val === value) return index;
    current = current.next;
    index++;
  } while (current);

  return null;
}`;

const insertCode = `function insert(value, index) {
  let currentIndex = 0;
  let current = this.list;
  let previous;
  while (index !== currentIndex && currentNode !== null) {
    previous = current;
    current = current.next;
    currentIndex++;
  }

  if (currentIndex === index) {
    let newNode = {
      val: value,
    };
    previous.next = newNode;
    newNode.next = current;
  };

  return this.list;
}`;

const deleteCode = `function delete(index) {
  let currentNode = this.list;
  let previousNode;
  for (let i = 0; i < index; i++) {
    previousNode = currentNode;
    currentNode = currentNode.next;
  }

  previousNode.next = currentNode.next;
  return this.list;
}`;

export const code = {
  search: searchCode,
  insert: insertCode,
  delete: deleteCode,
};

export const explanation = {
  search: [
    'Khởi tạo giá trị node hiện tại là head của linked list và giá trị index bằng 0',
    'So sánh giá trị của node hiện tại với giá trị đang tìm kiếm',
    'Nếu khớp thì trả về giá trị index',
    'Nếu không thì đặt node tiếp theo (node.next) là node hiện tại và tăng index lên 1',
    'Lặp lại bước 2',
    'Nếu kết thúc vòng loop mà vẫn chưa tìm thấy value thì trả về null',
  ],
  insert: [
    'Khởi tạo giá trị index hiện tại, node hiện tại và node phía sau node hiện tại',
    'Tìm vị trí để chèn node mới',
    'Nếu đã đến index cần tìm thì thêm node mới vào vị trí hiện tại',
    'Trả về giá trị head của linked list',
  ],
  delete: [
    'Khởi tạo giá trị index hiện tại, node hiện tại và node phía sau node hiện tại',
    'Tìm node cần xoá',
    'Kết nối node phía trước node cần xoá (previousNode) với node phía sau node cần xoá (currentNode.next)',
    'Trả về giá trị head của linked list',
  ],
};
