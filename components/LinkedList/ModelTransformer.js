import produce from 'immer';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformLinkedListModel = (currentData, operation, payload) => {
  switch (operation) {
    case 'remove': {
      const { key: nodeKey } = payload;
      return produce(currentData, draft => {
        const nodeToRemove = draft.find(({ key }) => key === nodeKey);
        if (nodeToRemove) nodeToRemove.visible = false;
      });
    }

    case 'reverseRemove': {
      const { key: nodeKey } = payload;
      return produce(currentData, draft => {
        const nodeToRemove = draft.find(({ key }) => key === nodeKey);
        if (nodeToRemove) nodeToRemove.visible = true;
      });
    }

    case 'add': {
      const { nodeData, previousNodeKey } = payload;
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
      const { key: nodeKey, value } = payload;
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
      const { index } = payload;
      return produce(currentData, draft => {
        draft[index].visited = true;
      });
    }

    case 'reverseVisit': {
      const { key } = payload;
      return produce(currentData, draft => {
        const index = draft.findIndex(({ key: nodeKey }) => key === nodeKey);
        draft[index].visited = false;
      });
    }

    case 'focus':
    case 'reverseFocus': {
      const { key } = payload;
      return produce(currentData, draft => {
        draft.forEach(item => (item.focus = false));
        // Nếu index === null nghĩa là đang unfocus tất cả các node
        if (key !== null) {
          const nodeToFocus = draft.find(({ key: nodeKey }) => nodeKey === key);
          nodeToFocus.focus = true;
        }
      });
    }

    case 'label': {
      const { key, label } = payload;
      return produce(currentData, draft => {
        const nodeToLabel = draft.find(({ key: nodeKey }) => key === nodeKey);
        nodeToLabel.label = label;
      });
    }

    default:
      return currentData;
  }
};

export default transformLinkedListModel;
