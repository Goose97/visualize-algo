import { Instructions } from 'instructions';
import { initHashTable } from './helper';
import { ObjectType } from 'types';
import { HashTable } from 'types/ds/HashTable';

export const hashTableInstruction = (
  data: number[],
  operation: HashTable.Api,
  parameters: any,
) => {
  switch (operation) {
    default:
      return [];
  }
};

const getCodeLine = (operation: HashTable.Api): ObjectType<string> => {
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
