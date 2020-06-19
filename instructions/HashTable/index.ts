import { Instructions } from 'instructions';
import { ObjectType } from 'types';
import { HashTable } from 'types/ds/HashTable';
import { produceAddressValuesMap } from './helper';
import { caculateKeyHash } from 'components/HashTable/helper';
import { HASH_TABLE_UNIVERSAL_KEY_SIZE } from '../../constants';
import { add } from 'lodash';

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
  { key, value, collisionResolution }: HashTable.InsertParams,
) => {
  let instructions = new Instructions();

  switch (collisionResolution) {
    case 'chaining': {
      const hashedAddress = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'insertKey', params: [key, value] },
        { name: 'highlightKey', params: [key] },
      ]);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'insertValue', params: [value, hashedAddress] },
        { name: 'highlightAddress', params: [hashedAddress] },
      ]);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'resetAll', params: [] },
      ]);

      return instructions.get();
    }

    case 'linearProbe': {
      const addressValuesMap = produceAddressValuesMap(data);

      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'insertKey', params: [key, value] },
        { name: 'highlightKey', params: [key] },
      ]);

      // Try to store in initital hash address, if already occupied, advance one address.
      // Keep repeat till we find the empty slot or out of slot to try
      let hashedAddress = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
      let displacement = 0;
      while (true) {
        // We only have to perform at most key size attempt
        if (displacement >= HASH_TABLE_UNIVERSAL_KEY_SIZE) break;

        const addressAttemptToFillValue = hashedAddress + displacement;
        instructions.pushActionsAndEndStep('hashTable', [
          { name: 'highlightAddress', params: [addressAttemptToFillValue] },
        ]);

        if (addressValuesMap[addressAttemptToFillValue]) {
          instructions.pushActions('hashTable', [
            { name: 'dehighlightAddress', params: [addressAttemptToFillValue] },
          ]);
          displacement++;
        } else break;
      }

      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'insertValue', params: [value, hashedAddress + displacement] },
        {
          name: 'assignAddressToKey',
          params: [key, hashedAddress + displacement],
        },
      ]);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'resetAll', params: [] },
      ]);
    }
  }

  return instructions.get();
};

const deleteInstruction = (
  data: any,
  { key, collisionResolution }: HashTable.InsertParams,
) => {
  let instructions = new Instructions();
  switch (collisionResolution) {
    case 'chaining':
      const hashedAddress = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'highlightKey', params: [key] },
        { name: 'highlightAddress', params: [hashedAddress] },
      ]);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'deleteValue', params: [data[key], hashedAddress] },
      ]);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'deleteKey', params: [key] },
      ]);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'resetAll', params: [] },
      ]);

      return instructions.get();
  }

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
