import { Instructions } from 'instructions';
import { ObjectType } from 'types';
import { HashTable } from 'types/ds/HashTable';

export const hashTableInstruction = (
  data: any,
  operation: HashTable.Api,
  parameters: any,
) => {
  switch (operation) {
    case 'insert':
      return insertInstruction(data, parameters);

    case 'delete':
      return deleteInstruction(data, parameters);

    default:
      return [];
  }
};

const insertInstruction = (
  data: any,
  { key, value }: HashTable.InsertParams,
) => {
  let instructions = new Instructions();
  instructions.setDuration(1000);
  instructions.pushActionsAndEndStep('hashTable', [
    { name: 'insert', params: [key, value] },
  ]);

  return instructions.get();
};

const deleteInstruction = (data: any, { key }: HashTable.InsertParams) => {
  let instructions = new Instructions();
  instructions.setDuration(1000);
  instructions.pushActionsAndEndStep('hashTable', [
    { name: 'delete', params: [key] },
  ]);

  return instructions.get();
};

const getCodeLine = (operation: HashTable.Api): ObjectType<string> => {
  switch (operation) {
    // case 'bubbleSort':
    //   return {
    //     init: '12-18',
    //     compare: '14',
    //     swap: '15',
    //     iteration: '12',
    //     step: '13',
    //   };

    // case 'selectionSort':
    //   return {
    //     init: '1',
    //     swap: '10-14',
    //     iteration: '3',
    //     findMin: '5',
    //     updateMin: '6-7',
    //     compare: '6',
    //   };

    // case 'insertionSort':
    //   return {
    //     init: '1',
    //     swap: '10-14',
    //     iteration: '3',
    //     findMin: '5',
    //     updateMin: '6-7',
    //     compare: '6',
    //   };

    default:
      return {};
  }
};
