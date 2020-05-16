import produce from 'immer';
import { last } from 'lodash';

import { StackModel, StackMethod } from './index.d';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformModel = (
  currentModel: StackModel,
  operation: StackMethod,
  payload: any[],
): StackModel => {
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

export default transformModel;
