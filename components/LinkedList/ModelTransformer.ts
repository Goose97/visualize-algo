import produce from 'immer';

import { LinkedListModel, LinkedListMethod } from './index.d';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformLinkedListModel = (
  currentData: LinkedListModel,
  operation: LinkedListMethod,
  payload: any[],
): LinkedListModel => {
  switch (operation) {
    case 'remove': {
      const [nodeKey] = payload;
      return produce(currentData, draft => {
        const nodeToRemove = draft.find(({ key }) => key === nodeKey);
        if (nodeToRemove) nodeToRemove.visible = false;
      });
    }

    case 'reverseRemove': {
      const [nodeKey] = payload;
      return produce(currentData, draft => {
        const nodeToRemove = draft.find(({ key }) => key === nodeKey);
        if (nodeToRemove) nodeToRemove.visible = true;
      });
    }

    case 'add': {
      const [nodeData, previousNodeKey] = payload;
      return produce(currentData, draft => {
        const newNodeIndex =
          draft.findIndex(({ key }) => key === previousNodeKey) + 1;
        draft.splice(newNodeIndex, 0, nodeData);
        // shift right every node in the right of the new node
        const shiftedNodes = draft
          .slice(newNodeIndex + 1)
          .map(currentData => ({ ...currentData, x: currentData.x + 160 }));
        draft.splice(newNodeIndex + 1, shiftedNodes.length, ...shiftedNodes);
      });
    }

    case 'reverseAdd': {
      const [_, nodeKey] = payload;
      return produce(currentData, draft => {
        const index = draft.findIndex(({ key }) => key === nodeKey);
        // shift left every node in the right of the removed node
        const shiftedNodes = draft
          .slice(index + 1)
          .map(currentData => ({ ...currentData, x: currentData.x - 160 }));
        draft.splice(index + 1, shiftedNodes.length, ...shiftedNodes);
        draft.splice(index, 1);
      });
    }

    case 'visit': {
      const [index] = payload;
      return produce(currentData, draft => {
        draft[index].visited = true;
      });
    }

    case 'reverseVisit': {
      const [key] = payload;
      return produce(currentData, draft => {
        const index = draft.findIndex(({ key: nodeKey }) => key === nodeKey);
        draft[index].visited = false;
      });
    }

    case 'focus':
    case 'reverseFocus': {
      const [key] = payload;
      console.log('payload', payload)
      return produce(currentData, draft => {
        draft.forEach(item => (item.focus = false));
        // Nếu index === null nghĩa là đang unfocus tất cả các node
        if (key !== null) {
          const nodeToFocus = draft.find(({ key: nodeKey }) => nodeKey === key);
          if (nodeToFocus) nodeToFocus.focus = true;
        }
      });
    }

    case 'label': {
      const [label, nodeKeyToLabel, removeThisLabelInOtherNode] = payload;
      return produce(currentData, draft => {
        if (removeThisLabelInOtherNode) {
          draft.forEach(node => {
            if (node.label === label) node.label = undefined;
          });
        }

        const nodeToLabel = draft.find(({ key }) => key === nodeKeyToLabel);
        if (nodeToLabel) nodeToLabel.label = label;
      });
    }

    case 'changePointer': {
      const [pointFrom, pointTo] = payload;
      return produce(currentData, draft => {
        const nodeHolderPointer = draft.find(({ key }) => key === pointFrom);
        if (nodeHolderPointer) {
          nodeHolderPointer.pointer = pointTo;
        }
      });
    }

    default:
      return currentData;
  }
};

export default transformLinkedListModel;
