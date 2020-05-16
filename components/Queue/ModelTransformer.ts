import produce from 'immer';

import { QueueModel, QueueMethod } from './index.d';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformModel = (
  currentModel: QueueModel,
  operation: QueueMethod,
  payload: any[],
): QueueModel => {
  switch (operation) {
    case 'dequeue': {
      // Find the first element from the back which still visible
      // And shift everything to right by decreasing offset by one
      return produce(currentModel, draft => {
        let found = false;
        for (let i = draft.length - 1; i >= 0; i--) {
          if (draft[i].visible && !found) {
            draft[i].visible = false;
            // draft[i].offsetFromFront = draft[i].offsetFromFront - 1;
            found = true;
          } else {
            draft[i].offsetFromFront = draft[i].offsetFromFront - 1;
          }
        }
      });
    }

    case 'enqueue': {
      const [itemToEnqueue] = payload;
      return produce(currentModel, draft => {
        draft.unshift(itemToEnqueue);
      });
    }

    default:
      return currentModel;
  }
};

export default transformModel;
