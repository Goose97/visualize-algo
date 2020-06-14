import produce from 'immer';

import { HashTable } from 'types/ds/HashTable';

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
        const newKey = { key, value, isNew: true };
        draft.push(newKey);
      });
    }

    case 'delete': {
      const [key] = payload;
      return produce(currentModel, draft => {
        const keyToDelete = draft.findIndex(
          ({ key: itemKey }) => key === itemKey,
        );
        draft.splice(keyToDelete, 1);
      });
    }

    case 'toggleIsNew': {
      const [key] = payload;
      return produce(currentModel, draft => {
        const keyToToggle = draft.find(({ key: itemKey }) => key === itemKey);
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
