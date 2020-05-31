import produce from 'immer';
import { compose } from 'lodash/fp';

import { BST } from 'types/ds/BST';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformBSTModel = (
  currentModel: BST.Model,
  operation: BST.Method,
  payload: any[],
): BST.Model => {
  switch (operation) {
    case 'visited': {
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
          if (newNode.value > parentNode.value!) {
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

    case 'label': {
      const [label, nodeKeyToLabel, removeThisLabelInOtherNode] = payload;
      return produce(currentModel, draft => {
        if (removeThisLabelInOtherNode) {
          draft.forEach(node => {
            const oldLabel = node.label;
            const newLabel =
              oldLabel && oldLabel.filter(item => item !== label);
            node.label = newLabel;
          });
        }

        const nodeToLabel = draft.find(({ key }) => key === nodeKeyToLabel);
        if (nodeToLabel) {
          const oldLabel = nodeToLabel.label || [];
          nodeToLabel.label = oldLabel.concat(label);
        }
      });
    }

    case 'resetAll': {
      // Reset focus, visited and label
      const listTransformation = ([
        'resetFocus',
        'resetVisited',
        'resetLabel',
      ] as BST.Method[]).map(method => (model: BST.Model) =>
        transformBSTModel(model, method, []),
      );
      return compose(listTransformation)(currentModel);
    }

    case 'resetVisited': {
      return produce(currentModel, draft => {
        draft.forEach(item => (item.visited = false));
      });
    }

    case 'resetLabel': {
      return produce(currentModel, draft => {
        draft.forEach(item => (item.label = []));
      });
    }

    default:
      return currentModel;
  }
};

export default transformBSTModel;
