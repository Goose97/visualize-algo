import produce from 'immer';

import { ArrayModel, ArrayMethod } from '.';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformArrayModel = (
  currentModel: ArrayModel,
  operation: ArrayMethod,
  payload: any[],
): ArrayModel => {
  switch (operation) {
    case 'swap': {
      const [from, to] = payload;
      return produce(currentModel, draft => {
        const fromNode = draft.find(({ key }) => key === from);
        const toNode = draft.find(({ key }) => key === to);
        if (fromNode && toNode) {
          const temp = fromNode.index;
          fromNode.index = toNode.index;
          toNode.index = temp;
        }
      });
    }

    default:
      return currentModel;
  }
};

export default transformArrayModel;
