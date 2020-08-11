import { Instructions } from 'instructions';
import { initArray } from './helper';
import { ObjectType } from 'types';
import { Array } from 'types/ds/Array';

export const arrayInstruction = (
  data: number[],
  operation: Array.Api,
  parameters: any
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

const selectionSortInstruction = (data: number[], params: Array.SortParams) => {
  let instructions = new Instructions();
  instructions.setDuration(750);
  let array = initArray(data);
  const codeLines = getCodeLine('selectionSort');
  let len = array.length;
  let i, j, min;

  instructions.setCodeLine(codeLines.init);

  for (i = 0; i < len; i++) {
    instructions.setCodeLine(codeLines.iteration);
    min = i;
    instructions.pushActionsAndEndStep('array', [
      { name: 'setUnsortedLine', params: [array[i].key] },
      { name: 'label', params: [array[i].key, 'min'] },
    ]);

    for (j = i + 1; j < len; j++) {
      instructions.pushActionsAndEndStep('array', [
        { name: 'resetFocusAll', params: [] },
        { name: 'focus', params: [array[min].key] },
        { name: 'focus', params: [array[j].key] },
      ]);
      instructions.setCodeLine(codeLines.findMin);
      instructions.setCodeLine(codeLines.compare);

      if (array[min].val > array[j].val) {
        instructions.pushActionsAndEndStep('array', [
          { name: 'resetFocus', params: [array[min].key] },
          { name: 'unlabel', params: [array[min].key] },
          { name: 'label', params: [array[j].key, 'min'] },
        ]);
        instructions.setCodeLine(codeLines.updateMin);
        min = j;
      }
    }

    if (min !== i) {
      instructions.pushActionsAndEndStep('array', [
        { name: 'swap', params: [array[min].key, array[i].key] },
        { name: 'resetFocusAll', params: [] },
        { name: 'unlabelAll', params: [] },
      ]);
      instructions.setCodeLine(codeLines.swap);
      let tmp = array[i];
      array[i] = array[min];
      array[min] = tmp;
    }
  }

  instructions.pushActionsAndEndStep('array', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const bubbleSortInstruction = (data: number[], params: Array.SortParams) => {
  let instructions = new Instructions();
  instructions.setDuration(500);
  let array = initArray(data);
  const codeLines = getCodeLine('bubbleSort');

  // Start make instruction
  let len = array.length;
  let i, j, stop;
  instructions.setCodeLine(codeLines.init);
  instructions.setExplainationStep(1);
  for (i = 0; i < len; i++) {
    instructions.setCodeLine(codeLines.iteration);
    instructions.setExplainationStep(2);
    for (j = 0, stop = len - i - 1; j < stop; j++) {
      instructions.pushActionsAndEndStep('array', [
        { name: 'resetFocusAll', params: [] },
        { name: 'focus', params: [array[j].key] },
        { name: 'focus', params: [array[j + 1].key] },
      ]);

      instructions.setCodeLine(codeLines.compare);
      instructions.endStep();
      if (array[j].val > array[j + 1].val) {
        instructions.setExplainationStep(3);
        instructions.setCodeLine(codeLines.swap);
        instructions.pushActionsAndEndStep('array', [
          { name: 'swap', params: [array[j].key, array[j + 1].key] },
        ]);

        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
      instructions.setCodeLine(codeLines.step);
      instructions.setExplainationStep(4);
      instructions.endStep();
      if (j + 1 === stop) {
        instructions.pushActionsAndEndStep('array', [
          { name: 'setUnsortedLine', params: [array[j + 1].key] },
        ]);
      }
    }
    console.log('instructions', instructions);
  }

  instructions.pushActionsAndEndStep('array', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const insertionSortInstruction = (data: number[], params: Array.SortParams) => {
  let instructions = new Instructions();
  instructions.setDuration(750);
  let array = initArray(data);
  const codeLines = getCodeLine('insertionSort');
  const swapArrayNodes = (indexA: number, indexB: number) => {
    let tmp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = tmp;
  };

  // Start make instruction
  let len = array.length;
  let i, j, keyValue;
  for (i = 1; i < len; i++) {
    instructions.pushActionsAndEndStep('array', [
      { name: 'focus', params: [array[i].key] },
      { name: 'setUnsortedLine', params: [array[i - 1].key] },
    ]);
    instructions.pushActionsAndEndStep('array', [
      { name: 'resetFocus', params: [array[i].key] },
      { name: 'setCurrentInsertionSortNode', params: [array[i].key] },
    ]);

    keyValue = array[i].val;
    j = i - 1;
    /* Move elements of arr[0..i-1], that are 
          greater than key, to one position ahead 
          of their current position */
    for (j = i - 1; j >= 0 && array[j].val > keyValue; j--) {
      instructions.pushActionsAndEndStep('array', [
        { name: 'setIndex', params: [array[j].key, j + 1] },
      ]);
      swapArrayNodes(j, j + 1);
    }

    instructions.pushActionsAndEndStep('array', [
      { name: 'setIndex', params: [array[j + 1].key, j + 1] },
      { name: 'setValue', params: [array[j + 1].key, keyValue] },
      { name: 'unsetCurrentInsertionSortNode', params: [] },
    ]);
    array[j + 1].val = keyValue;
  }

  instructions.pushActionsAndEndStep('array', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const getCodeLine = (operation: Array.Api): ObjectType<string> => {
  switch (operation) {
    case 'bubbleSort':
      return {
        init: '12-18',
        compare: '15',
        swap: '16',
        iteration: '6',
        step: '10',
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
