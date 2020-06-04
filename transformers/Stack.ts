import produce from 'immer';
import { last } from 'lodash';

import { Stack } from 'types/ds/Stack';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformStackModel = (
  currentModel: Stack.Model,
  operation: Stack.Method,
  payload: any[],
): Stack.Model => {
  switch (operation) {
    case 'push': {
      const [itemToPush] = payload;
      return produce(currentModel, draft => {
        draft.push(itemToPush);
      });
    }

    case 'pop': {
      return produce(currentModel, draft => {
        let lastItem = last(draft.filter(({ visible }) => !!visible));
        if (lastItem) lastItem.visible = false;
      });
    }

    default:
      return currentModel;
  }
};

export default transformStackModel;
