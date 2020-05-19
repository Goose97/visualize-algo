import produce from 'immer';

import { BSTModel, BSTMethod, BSTNodeModel } from './index.d';

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

    case 'insert': {
      const [parentKey, newNodeValue] = payload;
      const biggestKey = Math.max(...currentModel.map(({ key }) => key));
      const newNode: BSTNodeModel = {
        value: newNodeValue,
        left: null,
        right: null,
        key: biggestKey + 1,
      };
      return produce(currentModel, draft => {
        const parentNode = draft.find(({ key }) => key === parentKey);
        if (parentNode) {
          if (newNodeValue > parentNode.value) {
            parentNode.right = newNode.key;
          } else {
            parentNode.left = newNode.key;
          }

          draft.push(newNode);
        }
      });
    }

    default:
      return currentModel;
  }
};

export default transformBSTModel;
