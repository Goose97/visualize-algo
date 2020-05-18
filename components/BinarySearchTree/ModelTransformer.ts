import produce from 'immer';

import { BSTModel, BSTMethod } from './index.d';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformBSTModel = (
  currentModel: BSTModel,
  operation: BSTMethod,
  payload: any[],
): BSTModel => {
  switch (operation) {
    case 'visit': {
      const [nodeKeyToVisit] = payload;
      return produce(currentModel, draft => {
        const treeNode = draft.find(({ key }) => key === nodeKeyToVisit);
        if (treeNode) treeNode.visited = true;
      });
    }

    case 'focus': {
      const [nodeKeyToFocus] = payload;
      return produce(currentModel, draft => {
        const treeNode = draft.find(({ key }) => key === nodeKeyToFocus);
        if (treeNode) treeNode.focus = true;
      });
    }

    case 'resetFocus': {
      return produce(currentModel, draft => {
        draft.forEach(node => (node.focus = false));
      });
    }

    default:
      return currentModel;
  }
};

export default transformBSTModel;
