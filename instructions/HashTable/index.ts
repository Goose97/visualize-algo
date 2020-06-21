import { Instructions } from 'instructions';
import { ObjectType } from 'types';
import { HashTable } from 'types/ds/HashTable';
import { caculateKeyHash } from 'components/HashTable/helper';
import { HASH_TABLE_UNIVERSAL_KEY_SIZE } from '../../constants';
import { initLinearProbeHashTableData } from 'components/HashTable/helper';

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
        { name: 'insertKey', params: [key, value, hashedAddress] },
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
      const { memoryAddresses } = initLinearProbeHashTableData(data);
      const addressValuesMap = memoryAddresses.reduce<
        ObjectType<Array<number | string>>
      >((acc, { key, values }) => ({ ...acc, [key]: values }), {});

      let hashedAddress = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
      let displacement = 0;

      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'insertKey', params: [key, value, hashedAddress] },
        { name: 'highlightKey', params: [key] },
      ]);

      // Try to store in initital hash address, if already occupied, advance one address.
      // Keep repeat till we find the empty slot or out of slot to try
      let addressAttemptToFillValue;
      while (true) {
        // We only have to perform at most key size attempt
        if (displacement >= HASH_TABLE_UNIVERSAL_KEY_SIZE) break;

        addressAttemptToFillValue =
          (hashedAddress + displacement) % HASH_TABLE_UNIVERSAL_KEY_SIZE;
        instructions.pushActionsAndEndStep('hashTable', [
          {
            name: 'updateKeyAddress',
            params: [key, addressAttemptToFillValue],
          },
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
        { name: 'insertValue', params: [value, addressAttemptToFillValue] },
        {
          name: 'updateKeyAddress',
          params: [key, addressAttemptToFillValue],
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
  { key: keyToDelete, collisionResolution }: HashTable.InsertParams,
) => {
  let instructions = new Instructions();
  switch (collisionResolution) {
    case 'chaining': {
      const hashedAddress = caculateKeyHash(
        keyToDelete,
        HASH_TABLE_UNIVERSAL_KEY_SIZE,
      );
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'highlightKey', params: [keyToDelete] },
        { name: 'highlightAddress', params: [hashedAddress] },
      ]);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'deleteValue', params: [data[keyToDelete], hashedAddress] },
      ]);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'deleteKey', params: [keyToDelete] },
      ]);
      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'resetAll', params: [] },
      ]);
      break;
    }

    case 'linearProbe': {
      const { keys, memoryAddresses } = initLinearProbeHashTableData(data);
      const initialHashedAddress = caculateKeyHash(
        keyToDelete,
        HASH_TABLE_UNIVERSAL_KEY_SIZE,
      );
      const keyToDeleteObject = keys.find(({ key }) => key === keyToDelete);
      const realHashedAddress = keyToDeleteObject?.address;

      // We will try to find from the initial position, move one down if we can't find
      // at current position. Do at most HASH_TABLE_UNIVERSAL_KEY_SIZE attempt
      let displacement = 0;
      let found = false;
      while (true) {
        if (displacement >= HASH_TABLE_UNIVERSAL_KEY_SIZE) break;
        const currentCheckingAddress =
          (initialHashedAddress + displacement) % HASH_TABLE_UNIVERSAL_KEY_SIZE;

        instructions.pushActionsAndEndStep('hashTable', [
          { name: 'highlightKey', params: [keyToDelete] },
          { name: 'highlightAddress', params: [currentCheckingAddress] },
          {
            name: 'updateKeyAddress',
            params: [keyToDelete, currentCheckingAddress],
          },
        ]);

        // Reach a empty memory address
        const currentAddressInfo = memoryAddresses.find(
          ({ key }) => key === currentCheckingAddress,
        );
        if (!currentAddressInfo || !currentAddressInfo.values.length) break;

        if (currentCheckingAddress === realHashedAddress) {
          found = true;
          break;
        }

        // Move to next one
        displacement++;
        instructions.pushActions('hashTable', [
          { name: 'dehighlightAddress', params: [currentCheckingAddress] },
        ]);
      }

      if (found) {
        const valueToDelete = keyToDeleteObject?.value;
        instructions.pushActionsAndEndStep('hashTable', [
          { name: 'deleteValue', params: [valueToDelete, realHashedAddress] },
          { name: 'deleteKey', params: [keyToDelete] },
        ]);
      }

      instructions.pushActionsAndEndStep('hashTable', [
        { name: 'resetAll', params: [] },
      ]);
      break;
    }
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
