import { Instructions, initArray } from './helper';
import { ArrayOperation, SortParams } from './index.d';
import { StepInstruction } from '../../types';

export const arrayInstruction = (
  data: number[],
  operation: ArrayOperation,
  parameters: any
) => {
  switch (operation) {
    case 'bubbleSort':
      return bubbleSortInstruction(data, parameters);

    case 'selectionSort':
      return selectionSortInstruction(data, parameters);

    default:
      return [];
  }
};

const selectionSortInstruction = (data: number[], params: SortParams) => {
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'selectionSort'
  );
  let instructions = new Instructions();
  instructions.setDuration(500);
  let array = initArray(data);
  let len = array.length;
  let i, j, min;

  instructions.push({
    ..._getExplanationAndCodeLine('init'),
  });
  for (i = 0; i < len; i++) {
    instructions.push({
      ..._getExplanationAndCodeLine('iteration'),
    });
    min = i;
    instructions.push({
      actions: [{ name: 'label', params: [array[i].key, 'current'] }],
    });
    for (j = i + 1; j < len; j++) {
      instructions.push({
        actions: [
          { name: 'resetFocusAll', params: [] },
          { name: 'focus', params: [array[min].key] },
          { name: 'focus', params: [array[j].key] },
        ],
        ..._getExplanationAndCodeLine('findMin'),
      });
      instructions.push({
        ..._getExplanationAndCodeLine('compare'),
      });
      if (array[min].val > array[j].val) {
        instructions.push({
          actions: [
            { name: 'resetFocus', params: [array[min].key] },
            { name: 'unlabel', params: [array[min].key] },
            { name: 'label', params: [array[j].key, 'min'] },
            { name: 'label', params: [array[i].key, 'current'] },
          ],
          ..._getExplanationAndCodeLine('updateMin'),
        });
        min = j;
      }
    }
    if (min !== i) {
      instructions.push({
        actions: [
          { name: 'swap', params: [array[min].key, array[i].key] },
          { name: 'resetFocusAll', params: [] },
          // {name: 'focus', }
          { name: 'unlabel', params: [array[min].key] },
          { name: 'unlabel', params: [array[i].key] },
        ],
        ..._getExplanationAndCodeLine('swap'),
      });
      let tmp = array[i];
      array[i] = array[min];
      array[min] = tmp;
    }
    instructions.push({
      actions: [
        { name: 'complete', params: [array[i].key] },
        { name: 'resetFocusAll', params: [] },
        { name: 'unlabel', params: [array[min].key] },
      ],
    });
  }

  return instructions.get();
};

const bubbleSortInstruction = (data: number[], params: SortParams) => {
  const _getExplanationAndCodeLine = getExplanationAndCodeLine.bind(
    null,
    'bubbleSort'
  );
  let instructions = new Instructions();
  let array = initArray(data);

  instructions.push({
    actions: [{ name: 'focus', params: [0] }],
    ..._getExplanationAndCodeLine('init'),
  });

  // Start make instruction
  let len = array.length;
  let i, j, stop;
  instructions.push({
    ..._getExplanationAndCodeLine('init'),
  });
  for (i = 0; i < len; i++) {
    instructions.push({
      ..._getExplanationAndCodeLine('iteration'),
    });
    for (j = 0, stop = len - i - 1; j < stop; j++) {
      instructions.push({
        actions: [
          { name: 'resetFocusAll', params: [] },
          { name: 'focus', params: [array[j].key] },
          { name: 'focus', params: [array[j + 1].key] },
        ],
      });

      instructions.push({
        ..._getExplanationAndCodeLine('compare'),
      });
      if (array[j].val > array[j + 1].val) {
        instructions.push({
          actions: [{ name: 'swap', params: [array[j].key, array[j + 1].key] }],
          ..._getExplanationAndCodeLine('swap'),
        });
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }

      instructions.push({
        ..._getExplanationAndCodeLine('step'),
      });

      if (j + 1 === stop) {
        instructions.push({
          actions: [{ name: 'complete', params: [array[j + 1].key] }],
        });
      }
    }
  }

  instructions.push({
    actions: [{ name: 'complete', params: [array[0].key] }],
  });

  instructions.push({
    actions: [{ name: 'resetFocusAll', params: [] }],
  });

  return instructions.get();
};

const getExplanationAndCodeLine = (
  operation: ArrayOperation,
  subOperation: string
): Pick<StepInstruction, 'codeLine' | 'explanationStep'> => {
  switch (operation) {
    case 'bubbleSort':
      switch (subOperation) {
        case 'init':
          return { codeLine: '12-18', explanationStep: 1 };
        case 'compare':
          return { codeLine: '14', explanationStep: 3 };
        case 'swap':
          return { codeLine: '15', explanationStep: 4 };
        case 'iteration':
          return { codeLine: '12', explanationStep: 2 };
        case 'step':
          return { codeLine: '13', explanationStep: 5 };
        default:
          return {};
      }
    case 'selectionSort':
      switch (subOperation) {
        case 'init':
          return { codeLine: '1', explanationStep: 1 };
        case 'swap':
          return { codeLine: '10-14', explanationStep: 5 };
        case 'iteration':
          return { codeLine: '3', explanationStep: 2 };
        case 'findMin':
          return { codeLine: '5', explanationStep: 3 };
        case 'updateMin':
          return { codeLine: '6-7', explanationStep: 4 };
        case 'compare':
          return { codeLine: '6', explanationStep: 4 };
        default:
          return {};
      }
  }
};

const bubbleSort = `function swap(arr, firstIndex, secondIndex){
  let temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
}

function bubbleSort(arr){

  let len = arr.length,
      i, j, stop;

  for (i=0; i < len; i++){
      for (j=0, stop=len-i; j < stop; j++){
          if (arr[j] > arr[j+1]){
              swap(arr, j, j+1);
          }
      }
  }

  return arr;
}`;

const selectionSort = `function selectionSort(arr){
  let len = arr.length;
  for (let i = 0; i < len; i++) {
      let min = i;
      for (let j = i + 1; j < len; j++) {
          if (arr[min] > arr[j]) {
              min = j;
          }
      }
      if (min !== i) {
          let tmp = arr[i];
          arr[i] = arr[min];
          arr[min] = tmp;
      }
  }
  return arr;
}`;

export const code = {
  bubbleSort: bubbleSort,
  selectionSort: selectionSort,
};

export const explanation = {
  bubbleSort: [
    'Duyệt mảng N lần (i = 0,1,..., N-1 (N = arr.length)).',
    'Lần duyệt thứ i đưa phần tử lớn thứ i về đúng vị trí N - i mảng.',
    'So sánh phần tử j hiện tại với phần tử  kế tiếp nó j+1',
    'Nếu phần thử hiện tại lớn hơn phẩn tử kế tiếp nó, đổi chỗ hai phần tử này',
    'Duyệt phần tử kế tiếp phần tử hiện tại',
  ],

  selectionSort: [
    'Duyệt mảng N lần (i = 0,1,..., N-1 (N = arr.length)).',
    'Lần duyệt thứ i đưa phần tử nhỏ thứ i về đúng vị trí i mảng. Khởi tạo min của dãy từ phần tử thứ i đến phần tử thứ N-1 là i',
    'Duyệt mảng từ phần tử  j bắt đầu từ vị trí thứ i+1 đến vị trí thứ N-1 để tìm min',
    'Nếu phần tử  j nhỏ hơn min, đặt min bằng phần tử  j',
    'Sau lần duyệt thứ i, nếu min không phải phần tử thứ i, đổi chỗ  min, i',
  ],
};
