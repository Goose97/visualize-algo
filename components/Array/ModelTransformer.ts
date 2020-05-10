import produce from 'immer';

import { ArrayModel, ArrayMethod } from './index.d';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformArrayModel = (
  currentModel: ArrayModel,
  operation: ArrayMethod,
  payload: any[],
): ArrayModel => {
  switch (operation) {
    case 'swap': {
      return currentModel;
    }

    default:
      return currentModel;
  }
};

export default transformArrayModel;
