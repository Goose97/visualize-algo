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
          addressInfo.values.unshift(value);
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
          address,
        });
      });
    }

    case 'insertKey': {
      const [key, value] = payload;
      return produce(currentModel, draft => {
        const address = caculateKeyHash(key, HASH_TABLE_UNIVERSAL_KEY_SIZE);
        draft.keys.push({
          key,
          value,
          isNew: true,
          address,
        });
      });
    }

    case 'updateKeyAddress': {
      const [key, address] = payload;
      return produce(currentModel, draft => {
        const keyToUpdate = draft.keys.find(
          ({ key: itemKey }) => key === itemKey,
        );
        if (keyToUpdate) keyToUpdate.address = address;
      });
    }

    case 'insertValue': {
      const [value, address] = payload;
      return produce(currentModel, draft => {
        let addressInfo = draft.memoryAddresses.find(
          ({ key }) => key === address,
        );
        if (addressInfo) {
          addressInfo.values.unshift(value);
        } else {
          draft.memoryAddresses.push({
            key: address,
            values: [value],
          });
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

    case 'highlightKey': {
      const [key] = payload;
      return produce(currentModel, draft => {
        const keyToHighlight = draft.keys.find(
          ({ key: itemKey }) => key === itemKey,
        );
        if (keyToHighlight) keyToHighlight.highlight = true;
      });
    }

    case 'highlightAddress': {
      // Sometimes the address we want to highlight is not exist yet in modal
      // insert a empty one in
      const [address] = payload;
      return produce(currentModel, draft => {
        const addressToHighlight = draft.memoryAddresses.find(
          ({ key }) => key === address,
        );
        if (addressToHighlight) addressToHighlight.highlight = true;
        else {
          const emptyAddress = {
            key: address,
            values: [],
            highlight: true,
          };
          draft.memoryAddresses.push(emptyAddress);
        }
      });
    }

    case 'dehighlightAddress': {
      const [address] = payload;
      return produce(currentModel, draft => {
        const addressToHighlight = draft.memoryAddresses.find(
          ({ key }) => key === address,
        );
        if (addressToHighlight) addressToHighlight.highlight = false;
      });
    }

    case 'deleteKey': {
      const [key] = payload;
      return produce(currentModel, draft => {
        draft.keys = draft.keys.filter(({ key: itemKey }) => key !== itemKey);
      });
    }

    case 'deleteValue': {
      const [value, address] = payload;
      return produce(currentModel, draft => {
        const addressToDelete = draft.memoryAddresses.find(
          ({ key }) => key === address,
        );
        if (addressToDelete) {
          const valuesAfterDelete = addressToDelete.values.filter(
            item => item !== value,
          );
          if (valuesAfterDelete.length)
            addressToDelete.values = valuesAfterDelete;
          else {
            draft.memoryAddresses = draft.memoryAddresses.filter(
              ({ key }) => key !== address,
            );
          }
        }
      });
    }

    case 'resetAll': {
      return produce(currentModel, draft => {
        draft.keys.forEach(key => (key.highlight = false));
        draft.memoryAddresses.forEach(address => (address.highlight = false));
      });
    }

    default:
      return currentModel;
  }
};

export default transformHashTableModel;
