import produce from 'immer';
import { uniq } from 'lodash';

import { HashTable } from 'types/ds/HashTable';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformHashTableModel = (
  currentModel: HashTable.Model,
  operation: HashTable.Method,
  payload: any[],
): HashTable.Model => {
  switch (operation) {
  }
};

export default transformHashTableModel;
