import produce from 'immer';

import { HashTable } from 'types/ds/HashTable';
import { caculateKeyHash } from 'components/HashTable/helper';
import { HASH_TABLE_UNIVERSAL_KEY_SIZE } from '../constants';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformHashTableModel = (
  currentModel: HashTable.Model,
  operation: HashTable.Method,
  payload: any[],
): HashTable.Model => {
  switch (operation) {
    case 'insert': {
      const [key, value] = payload;
      return produce(currentModel, draft => {
        const address = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
        let addressInfo = draft.memoryAddresses.find(
          ({ key }) => key === address,
        );
        if (addressInfo) {
          addressInfo.values.push(value);
        } else {
          addressInfo = {
            key: address,
            values: [value],
          };
        }

        draft.keys.push({
          key,
          value,
          isNew: true,
        });
      });
    }

    case 'insertKey': {
      const [key, value] = payload;
      return produce(currentModel, draft => {
        draft.keys.push({
          key,
          value,
          isNew: true,
        });
      });
    }

    case 'insertValue': {
      const [key, value] = payload;
      return produce(currentModel, draft => {
        const address = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
        let addressInfo = draft.memoryAddresses.find(
          ({ key }) => key === address,
        );
        if (addressInfo) {
          addressInfo.values.push(value);
        } else {
          addressInfo = {
            key: address,
            values: [value],
          };
        }
      });
    }

    case 'delete': {
      const [key] = payload;
      return produce(currentModel, draft => {
        // Delete value in memory address
        const address = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
        const memoryAddress = draft.memoryAddresses.find(
          ({ key }) => key === address,
        )!;
        const valueOfKey = draft.keys.find(
          ({ key: itemKey }) => key === itemKey,
        )?.value;
        memoryAddress.values = memoryAddress.values.filter(
          value => value !== valueOfKey,
        );

        // Delete key
        const keyToDelete = draft.keys.findIndex(
          ({ key: itemKey }) => key === itemKey,
        );
        draft.keys.splice(keyToDelete, 1);
      });
    }

    case 'toggleIsNew': {
      const [key] = payload;
      return produce(currentModel, draft => {
        const keyToToggle = draft.keys.find(
          ({ key: itemKey }) => key === itemKey,
        );
        if (keyToToggle) {
          const oldIsNew = !!keyToToggle.isNew;
          keyToToggle.isNew = !oldIsNew;
        }
      });
    }

    default:
      return currentModel;
  }
};

export default transformHashTableModel;
