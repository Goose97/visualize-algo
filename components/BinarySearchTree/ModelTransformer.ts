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
      const [parentKey, newNode] = payload;
      return produce(currentModel, draft => {
        const parentNode = draft.find(({ key }) => key === parentKey);
        if (parentNode) {
          if (newNode.value > parentNode.value) {
            parentNode.right = newNode.key;
          } else {
            parentNode.left = newNode.key;
          }

          draft.push(newNode);
        }
      });
    }

    case 'delete': {
      const [keyToDelete] = payload;
      return produce(currentModel, draft => {
        const nodeToDelete = draft.find(({ key }) => key === keyToDelete);
        if (nodeToDelete) nodeToDelete.visible = false;
      });
    }

    case 'focusToDelete': {
      const [keyToDelete] = payload;
      return produce(currentModel, draft => {
        const nodeToDelete = draft.find(({ key }) => key === keyToDelete);
        if (nodeToDelete) nodeToDelete.aboutToDelete = true;
      });
    }

    case 'setValue': {
      const [value, keyToSet] = payload;
      return produce(currentModel, draft => {
        const nodeToSetValue = draft.find(({ key }) => key === keyToSet);
        if (nodeToSetValue) nodeToSetValue.value = value;
      });
    }

    default:
      return currentModel;
  }
};

export default transformBSTModel;
