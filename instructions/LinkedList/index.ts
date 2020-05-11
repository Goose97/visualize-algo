import { Instructions, initLinkedList } from './helper';
import {
  LinkedListOperation,
  SearchParams,
  InsertParams,
  DeleteParams,
} from './index.d';
import { StepInstruction } from 'types';
import { LinkedListNode } from './helper';

export const linkedListInstruction = (
  data: number[],
  operation: LinkedListOperation,
  parameters: any,
) => {
  switch (operation) {
    case 'search':
      return searchInstruction(data, parameters);

    case 'insert':
      return insertInstruction(data, parameters);

    case 'delete':
      return deleteInstruction(data, parameters);

    case 'reverse':
      return reverseInstruction(data);

    default:
      return [];
  }
};

const searchInstruction = (data: number[], { value }: SearchParams) => {
  const linkedList = initLinkedList(data);
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'search',
  );
  let instructions = new Instructions();

  // Start make instruction
  let current: LinkedListNode | null = linkedList;
  let found = false;
  instructions.push({
    actions: [{ name: 'focus', params: [0] }],
    ..._getExplanationAndCodeLine('init'),
  });

  do {
    instructions.push({
      ..._getExplanationAndCodeLine('compare'),
    });
    if (current.val === value) {
      found = true;
      instructions.push({
        ..._getExplanationAndCodeLine('compareSuccess'),
      });
    } else {
      current = current.next;
      if (current) {
        instructions.push({
          actions: [
            { name: 'visit', params: [current.key] },
            { name: 'label', params: ['current', current.key, true] },
          ],
          ..._getExplanationAndCodeLine('moveNext'),
        });

        instructions.push({
          ..._getExplanationAndCodeLine('repeat'),
        });
      }
    }
  } while (current && !found);

  if (!found) {
    instructions.push({
      ..._getExplanationAndCodeLine('outOfLoop'),
    });
  }

  return instructions.get();
};

const insertInstruction = (data: number[], { value, index }: InsertParams) => {
  const linkedList = initLinkedList(data);
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'insert',
  );
  let instructions = new Instructions();
  // Start make instruction
  let previousNode: LinkedListNode | undefined;
  let currentNode: LinkedListNode | null = linkedList!;
  let currentIndex = 0;
  instructions.push({
    actions: [
      { name: 'focus', params: [0] },
      { name: 'label', params: ['current', currentNode.key, true] },
    ],
    ..._getExplanationAndCodeLine('init'),
  });

  while (currentIndex !== index && currentNode !== null) {
    previousNode = currentNode;
    currentNode = currentNode.next;
    currentIndex++;

    if (currentNode) {
      instructions.push({
        actions: [
          { name: 'visit', params: [currentNode.key, true] },
          { name: 'label', params: ['previous', previousNode.key, true] },
          { name: 'label', params: ['current', currentNode.key, true] },
        ],
        ..._getExplanationAndCodeLine('findPosition'),
      });
    }
  }

  if (index === currentIndex) {
    let newNode = new LinkedListNode(value, data.length);
    previousNode!.next = newNode;
    newNode.next = currentNode;

    instructions.push({
      actions: [
        { name: 'add', params: [value, previousNode!.key, newNode.key] },
        { name: 'changePointer', params: [previousNode!.key, newNode.key] },
        {
          name: 'changePointer',
          params: [newNode.key, currentNode?.key],
        },
      ],
      ..._getExplanationAndCodeLine('insert'),
    });
  }

  instructions.push({
    actions: [{ name: 'focus', params: [null] }],
    ..._getExplanationAndCodeLine('complete'),
  });

  return instructions.get();
};

const deleteInstruction = (data: number[], { index }: DeleteParams) => {
  const linkedList = initLinkedList(data);
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'delete',
  );
  let instructions = new Instructions();
  // Start make instruction
  let previousNode: LinkedListNode | null = null;
  let currentNode: LinkedListNode | null = linkedList;
  instructions.push({
    actions: [{ name: 'focus', params: [0] }],
    ..._getExplanationAndCodeLine('init'),
  });

  for (let i = 0; i < index; i++) {
    previousNode = currentNode;
    currentNode = currentNode!.next;

    instructions.push({
      actions: [{ name: 'visit', params: [currentNode?.key] }],
      ..._getExplanationAndCodeLine('findPosition'),
    });
  }

  previousNode!.next = currentNode!.next;

  instructions.push({
    actions: [
      { name: 'remove', params: [currentNode!.key] },
      {
        name: 'changePointer',
        params: [previousNode!.key, currentNode!.next && currentNode!.next.key],
      },
    ],
    ..._getExplanationAndCodeLine('delete'),
  });

  instructions.push({
    actions: [{ name: 'focus', params: [null] }],
    ..._getExplanationAndCodeLine('complete'),
  });

  return instructions.get();
};

const reverseInstruction = (data: number[]) => {
  const linkedList = initLinkedList(data);
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'reverse',
  );
  let instructions = new Instructions();
  // Start make instruction
  let previousNode: LinkedListNode | null = null;
  let currentNode: LinkedListNode | null = linkedList;
  let tmp;
  instructions.push({
    actions: [
      { name: 'focus', params: [0] },
      { name: 'label', params: ['current', 0, true] },
    ],
    ..._getExplanationAndCodeLine('init'),
  });

  while (currentNode) {
    tmp = currentNode.next;
    instructions.push({
      actions: [
        {
          name: 'label',
          params: ['temp', tmp && tmp.key, true],
        },
        {
          name: 'changePointer',
          params: [currentNode.key, previousNode && previousNode.key],
        },
      ],
      ..._getExplanationAndCodeLine('reversePointer'),
    });

    currentNode.next;
    previousNode = currentNode;
    currentNode = tmp;

    const currentNodeKey = currentNode && currentNode.key;
    instructions.push({
      actions: [
        { name: 'focus', params: [currentNodeKey] },
        { name: 'label', params: ['current', currentNodeKey, true] },
        { name: 'label', params: ['previous', previousNode.key, true] },
      ],
      ..._getExplanationAndCodeLine('moveNext'),
    });
  }

  instructions.push({
    actions: [],
    ..._getExplanationAndCodeLine('complete'),
  });

  return instructions.get();
};

const getExplanationAndCodeLine = (
  operation: LinkedListOperation,
  subOperation: string,
): Pick<StepInstruction, 'codeLine' | 'explanationStep'> => {
  switch (operation) {
    case 'search':
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

    case 'insert': {
      switch (subOperation) {
        case 'init':
          return { codeLine: '2-4', explanationStep: 1 };
        case 'findPosition':
          return { codeLine: '5-9', explanationStep: 2 };
        case 'insert':
          return { codeLine: '11-17', explanationStep: 3 };
        case 'complete':
          return { codeLine: '19', explanationStep: 4 };
        default:
          return {};
      }
    }

    case 'delete':
      switch (subOperation) {
        case 'init':
          return { codeLine: '2-3', explanationStep: 1 };
        case 'findPosition':
          return { codeLine: '4-7', explanationStep: 2 };
        case 'delete':
          return { codeLine: '9', explanationStep: 3 };
        case 'complete':
          return { codeLine: '10', explanationStep: 4 };
        default:
          return {};
      }

    case 'reverse':
      switch (subOperation) {
        case 'init':
          return { codeLine: '2-4', explanationStep: 1 };
        case 'reversePointer':
          return { codeLine: '7-11', explanationStep: 2 };
        case 'moveNext':
          return { codeLine: '13-15', explanationStep: 3 };
        case 'complete':
          return { codeLine: '18', explanationStep: 4 };
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
    // save next before we overwrite current.next!
    temp = current.next;

    // reverse pointer
    current.next = previous;

    // step forward in the list
    previous = current;
    current = temp;
  }

  return previous;
}`;

export const code = {
  search: searchCode,
  insert: insertCode,
  delete: deleteCode,
  reverse: reverseCode,
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
};
