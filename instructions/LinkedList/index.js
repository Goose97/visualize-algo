import { Instructions, initLinkedList } from './helper';

export const linkedListInstruction = (data, operation, parameters) => {
  switch (operation) {
    case 'search':
      return searchInstruction(data, parameters);

    default:
      return [];
  }
};

const searchInstruction = (data, { value }) => {
  const linkedList = initLinkedList(data);
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'search',
  );
  let instructions = new Instructions();

  // Start make instruction
  let current = linkedList;
  let index = 0;
  let found = false;
  instructions.push({
    data,
    currentNode: index,
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
      index++;
      if (current) {
        instructions.push({
          currentNode: index,
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

const getExplanationAndCodeLine = (operation, subOperation) => {
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

    default:
      return [];
  }
};

const searchCode = `search(value) {
  let current = this.list;
  let index = 0;
  do {
    // Nếu tìm thấy thì return index
    if (current.val === value) return index;
    current = current.next;
    index++;
  } while (current)

  return index;
}`;

export const code = {
  search: searchCode,
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
};
