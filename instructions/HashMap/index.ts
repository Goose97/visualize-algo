import { Instructions } from 'instructions';
import { initHashMap } from './helper';
import { ObjectType } from 'types';
import { HashMap } from 'types/ds/HashMap';

export const hashMapInstruction = (
  data: number[],
  operation: HashMap.Api,
  parameters: any,
) => {
  switch (operation) {
    case 'bubbleSort':
      return bubbleSortInstruction(data, parameters);

    case 'selectionSort':
      return selectionSortInstruction(data, parameters);

    case 'insertionSort':
      return insertionSortInstruction(data, parameters);

    default:
      return [];
  }
};

const selectionSortInstruction = (data: number[], params: HashMap.SortParams) => {
  let instructions = new Instructions();
  instructions.setDuration(500);
  let hashMap = initHashMap(data);
  const codeLines = getCodeLine('selectionSort');
  let len = hashMap.length;
  let i, j, min;

  instructions.setCodeLine(codeLines.init);

  for (i = 0; i < len; i++) {
    instructions.setCodeLine(codeLines.iteration);
    min = i;
    instructions.pushActionsAndEndStep('hashMap', [
      { name: 'label', params: [hashMap[i].key, 'current'] },
    ]);
    for (j = i + 1; j < len; j++) {
      instructions.pushActionsAndEndStep('hashMap', [
        { name: 'resetFocusAll', params: [] },
        { name: 'focus', params: [hashMap[min].key] },
        { name: 'focus', params: [hashMap[j].key] },
      ]);
      instructions.setCodeLine(codeLines.findMin);
      instructions.setCodeLine(codeLines.compare);

      if (hashMap[min].val > hashMap[j].val) {
        instructions.pushActionsAndEndStep('hashMap', [
          { name: 'resetFocus', params: [hashMap[min].key] },
          { name: 'unlabel', params: [hashMap[min].key] },
          { name: 'label', params: [hashMap[j].key, 'min'] },
          { name: 'label', params: [hashMap[i].key, 'current'] },
        ]);
        instructions.setCodeLine(codeLines.updateMin);
        min = j;
      }
    }
    if (min !== i) {
      instructions.pushActionsAndEndStep('hashMap', [
        { name: 'swap', params: [hashMap[min].key, hashMap[i].key] },
        { name: 'resetFocusAll', params: [] },
        { name: 'unlabel', params: [hashMap[min].key] },
        { name: 'unlabel', params: [hashMap[i].key] },
      ]);
      instructions.setCodeLine(codeLines.swap);
      let tmp = hashMap[i];
      hashMap[i] = hashMap[min];
      hashMap[min] = tmp;
    }
    instructions.pushActionsAndEndStep('hashMap', [
      { name: 'complete', params: [hashMap[i].key] },
      { name: 'resetFocusAll', params: [] },
      { name: 'unlabel', params: [hashMap[min].key] },
    ]);
  }

  return instructions.get();
};

const bubbleSortInstruction = (data: number[], params: HashMap.SortParams) => {
  let instructions = new Instructions();
  instructions.setDuration(500);
  let hashMap = initHashMap(data);
  const codeLines = getCodeLine('bubbleSort');

  // Start make instruction
  let len = hashMap.length;
  let i, j, stop;
  instructions.setCodeLine(codeLines.init);
  for (i = 0; i < len; i++) {
    instructions.setCodeLine(codeLines.iteration);
    for (j = 0, stop = len - i - 1; j < stop; j++) {
      instructions.pushActionsAndEndStep('hashMap', [
        { name: 'resetFocusAll', params: [] },
        { name: 'focus', params: [hashMap[j].key] },
        { name: 'focus', params: [hashMap[j + 1].key] },
      ]);

      instructions.setCodeLine(codeLines.compare);
      if (hashMap[j].val > hashMap[j + 1].val) {
        instructions.pushActionsAndEndStep('hashMap', [
          { name: 'swap', params: [hashMap[j].key, hashMap[j + 1].key] },
        ]);
        instructions.setCodeLine(codeLines.swap);
        let temp = hashMap[j];
        hashMap[j] = hashMap[j + 1];
        hashMap[j + 1] = temp;
      }
      instructions.setCodeLine(codeLines.step);

      if (j + 1 === stop) {
        instructions.pushActionsAndEndStep('hashMap', [
          { name: 'complete', params: [hashMap[j + 1].key] },
        ]);
      }
    }
  }

  instructions.pushActionsAndEndStep('hashMap', [
    { name: 'complete', params: [hashMap[0].key] },
    { name: 'resetFocusAll', params: [] },
  ]);

  return instructions.get();
};

const insertionSortInstruction = (data: number[], params: HashMap.SortParams) => {
  let instructions = new Instructions();
  instructions.setDuration(1000);
  let hashMap = initHashMap(data);
  const codeLines = getCodeLine('insertionSort');

  // Start make instruction

  let len = hashMap.length;
  let i, j, keyValue;
  for (i = 1; i < len; i++) {
    instructions.pushActionsAndEndStep('hashMap', [
      { name: 'setLine', params: [hashMap[i].key] },
    ]);
    keyValue = hashMap[i].val;
    j = i - 1;
    /* Move elements of arr[0..i-1], that are 
          greater than key, to one position ahead 
          of their current position */
    for (j = i - 1; j >= 0 && hashMap[j].val > keyValue; j--) {
      instructions.pushActionsAndEndStep('hashMap', [
        { name: 'setValue', params: [hashMap[j + 1].key, hashMap[j].val] },
        { name: 'setValue', params: [hashMap[j].key, null] },
      ]);
      hashMap[j + 1].val = hashMap[j].val;
    }
    instructions.pushActionsAndEndStep('hashMap', [
      { name: 'setValue', params: [hashMap[j + 1].key, keyValue] },
    ]);
    hashMap[j + 1].val = keyValue;
  }

  return instructions.get();
};

const getCodeLine = (operation: HashMap.Api): ObjectType<string> => {
  switch (operation) {
    case 'bubbleSort':
      return {
        init: '12-18',
        compare: '14',
        swap: '15',
        iteration: '12',
        step: '13',
      };
    
    case 'selectionSort':
      return {
        init: '1',
        swap: '10-14',
        iteration: '3',
        findMin: '5',
        updateMin: '6-7',
        compare: '6',
      };
    
    case 'insertionSort':
      return {
        init: '1',
        swap: '10-14',
        iteration: '3',
        findMin: '5',
        updateMin: '6-7',
        compare: '6',
      };
    
    default:
      return {};
  }
};
