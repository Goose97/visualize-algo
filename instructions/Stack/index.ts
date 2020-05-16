import { Instructions, initStack } from './helper';
import { StackOperation, EnstackParams } from './index.d';
import { StepInstruction } from 'types';

export const stackInstruction = (
  data: number[],
  operation: StackOperation,
  parameters: any,
) => {
  switch (operation) {
    case 'push':
      return pushInstruction(data, parameters);

    case 'pop':
      return popInstruction(data);

    default:
      return [];
  }
};

const pushInstruction = (data: number[], { value }: EnstackParams) => {
  const linkedList = initStack(data);
  // const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
  //   null,
  //   'search',
  // );
  let instructions = new Instructions();
  instructions.push({ actions: [{ name: 'enstack', params: [value] }] });

  return instructions.get();
};

const popInstruction = (data: number[]) => {
  const linkedList = initStack(data);
  // const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
  //   null,
  //   'search',
  // );
  let instructions = new Instructions();
  instructions.push({ actions: [{ name: 'destack', params: [] }] });

  return instructions.get();
};

const getExplanationAndCodeLine = (
  operation: StackOperation,
  subOperation: string,
): Pick<StepInstruction, 'codeLine' | 'explanationStep'> => {
  switch (operation) {
    case 'enstack':
      switch (subOperation) {
        case 'init':
          return { codeLine: '2-3', explanationStep: 1 };
        case 'compare':
          return { codeLine: '6', explanationStep: 2 };
        case 'compareSuccess':
          return { codeLine: '6', explanationStep: 3 };
        case 'moveNext':
          return { codeLine: '7-8', explanationStep: 4 };
        case 'repeat':
          return { explanationStep: 5 };
        case 'outOfLoop':
          return { codeLine: '11', explanationStep: 6 };
        default:
          return {};
      }

    default:
      return {};
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
  let current = this.list;
  let previous;
  for (let i = 0; i < index; i++) {
    previous = current;
    current = current.next;
  }

  previous.next = current.next;
  return this.list;
}`;

const reverseCode = `function reverse(head) {
  let current = head;
  let previous = null;
  let temp;

  while (current) {
    // Save next before we overwrite current.next!
    temp = current.next;

    // Reverse pointer
    current.next = previous;link

    // Step forward in the list
    previous = current;
    current = temp;
  }

  return previous;
}`;

const detectCycleCode = `function detectCycle(head) {
  let slow = head;
  let fast = head.next;

  while (slow !== null && fast !== null) {
    // If fast and slow meets, this mean the linked list does have a loop
    if (fast === slow) return true;

    // The fast pointer will jump two nodes while the slow only jump one
    slow = slow.next;
    fast = fast.next ? fast.next.next : null;
  }

  // If either slow or fast reach the end, the linked list doesn't have any loop
  return false;
}`;

export const code = {
  search: searchCode,
  insert: insertCode,
  delete: deleteCode,
  reverse: reverseCode,
  detectCycle: detectCycleCode,
};

export const explanation = {
  search: [
    'Khởi tạo biến lưu giá trị node hiện tại là head của linked list và giá trị index bằng 0',
    'So sánh giá trị của node hiện tại với giá trị đang tìm kiếm',
    'Nếu khớp thì trả về giá trị index',
    'Nếu không thì đặt node tiếp theo (node.next) là node hiện tại và tăng index lên 1',
    'Lặp lại bước 2',
    'Nếu kết thúc vòng loop mà vẫn chưa tìm thấy value thì trả về null',
  ],
  insert: [
    'Khởi tạo biến lưu giá trị index hiện tại, node hiện tại và node phía sau node hiện tại',
    'Tìm vị trí để chèn node mới',
    'Nếu đã đến index cần tìm thì thêm node mới vào vị trí hiện tại',
    'Trả về giá trị head của linked list',
  ],
  delete: [
    'Khởi tạo biến lưu giá trị index hiện tại, node hiện tại và node phía sau node hiện tại',
    'Tìm node cần xoá',
    'Kết nối node phía trước node cần xoá (previousNode) với node phía sau node cần xoá (currentNode.next)',
    'Trả về giá trị head của linked list',
  ],
  reverse: [
    'Khởi tạo biến lưu giá trị node hiện tại, node phía sau node hiện tại và biến tạm tmp',
    'Lưu node tiếp theo (current.next) vào biến tạm và đảo ngược pointer: node hiện tại trỏ đến node phía sau (previous)',
    'Di chuyển đến node tiếp theo',
    'Trả về giá trị head mới',
  ],
  detectCycle: [
    'Khởi tạo hai biến lưu giá trị slow và fast',
    'Nếu slow hoặc fast có giá trị bằng null thì thoát khỏi vòng while và trả về giá trị false, linked list không có cycle',
    'Nếu slow và fast bằng nhau thì trả về giá trị true, linked list có cycle',
    'Di chuyển slow và fast dến node tiếp theo, slow nhảy 1 node còn fast nhảy 2 node',
  ],
};
