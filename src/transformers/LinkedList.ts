import produce from 'immer';
import { compose } from 'lodash/fp';

import { LinkedList } from 'types/ds/LinkedList';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformLinkedListModel = (
  currentModel: LinkedList.Model,
  operation: LinkedList.Method,
  payload: any[],
): LinkedList.Model => {
  switch (operation) {
    case 'remove': {
      const [nodeKey] = payload;
      return produce(currentModel, draft => {
        const nodeToRemove = draft.find(({ key }) => key === nodeKey);
        if (nodeToRemove) nodeToRemove.visible = false;
      });
    }

    case 'removeByValue': {
      const [nodeValue] = payload;
      return produce(currentModel, draft => {
        const nodeToRemove = draft.find(({ value }) => value === nodeValue);
        if (nodeToRemove) nodeToRemove.visible = false;
      });
    }

    case 'insert': {
      const [nodeData, previousNodeKey] = payload;
      return produce(currentModel, draft => {
        const newNodeIndex =
          draft.findIndex(({ key }) => key === previousNodeKey) + 1;
        draft.splice(newNodeIndex, 0, nodeData);
        // shift right every node in the right of the new node
        const shiftedNodes = draft
          .slice(newNodeIndex + 1)
          .map(currentModel => ({ ...currentModel, x: currentModel.x + 160 }));
        draft.splice(newNodeIndex + 1, shiftedNodes.length, ...shiftedNodes);
      });
    }

    case 'visited': {
      const [index] = payload;
      return produce(currentModel, draft => {
        draft[index].visited = true;
      });
    }

    case 'focus': {
      const [key, keepOtherNodeFocus] = payload;
      return produce(currentModel, draft => {
        if (!keepOtherNodeFocus) draft.forEach(item => (item.focus = false));
        // Nếu index === null nghĩa là đang unfocus tất cả các node
        if (key !== null) {
          const nodeToFocus = draft.find(({ key: nodeKey }) => nodeKey === key);
          if (nodeToFocus) nodeToFocus.focus = true;
        }
      });
    }

    case 'label': {
      const [label, nodeKeyToLabel, removeThisLabelInOtherNode] = payload;
      return produce(currentModel, draft => {
        if (removeThisLabelInOtherNode) {
          draft.forEach(node => {
            const oldLabel = node.label;
            if (oldLabel) {
              //@ts-ignore
              const newLabel = oldLabel.filter(item => item !== label);
              node.label = newLabel;
            }
          });
        }

        const nodeToLabel = draft.find(({ key }) => key === nodeKeyToLabel);
        if (nodeToLabel) {
          const oldLabel = nodeToLabel.label || [];
          //@ts-ignore
          nodeToLabel.label = oldLabel.concat(label);
        }
      });
    }

    case 'changePointer': {
      const [pointFrom, pointTo] = payload;
      return produce(currentModel, draft => {
        const nodeHolderPointer = draft.find(({ key }) => key === pointFrom);
        if (nodeHolderPointer) {
          nodeHolderPointer.pointer = pointTo;
        }
      });
    }

    case 'resetAll': {
      // Reset focus, visited and label
      const listTransformation = ([
        'resetFocus',
        'resetVisited',
        'resetLabel',
      ] as LinkedList.Method[]).map(method => (model: LinkedList.Model) =>
        transformLinkedListModel(model, method, []),
      );
      return compose(listTransformation)(currentModel);
    }

    case 'resetFocus': {
      return produce(currentModel, draft => {
        draft.forEach(item => (item.focus = false));
      });
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

export default transformLinkedListModel;
