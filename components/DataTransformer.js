import produce from 'immer';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformData = (type, ...args) => {
  switch (type) {
    case 'linkedList':
      return transformLinkedListData(...args);
  }
};

const transformLinkedListData = (currentData, operation, payload) => {
  switch (operation) {
    case 'remove': {
      const { index } = payload;
      return produce(currentData, draft => {
        draft[index].visible = false;
      });
    }

    case 'reverseRemove': {
      const { index } = payload;
      return produce(currentData, draft => {
        draft[index].visible = true;
      });
    }

    case 'add': {
      const {
        nodeData,
        nodeData: { index },
      } = payload;
      return produce(currentData, draft => {
        draft.splice(index, 0, nodeData);
        // shift right every node in the right of the new node
        const shiftedNodes = draft
          .slice(index + 1)
          .map(currentData => ({ ...currentData, x: currentData.x + 160 }));
        draft.splice(index + 1, shiftedNodes.length, ...shiftedNodes);
      });
    }

    case 'reverseAdd': {
      const { index, value } = payload;
      return produce(currentData, draft => {
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
      const { index } = payload;
      return produce(currentData, draft => {
        draft[index].visited = false;
      });
    }

    default:
      return currentData;
  }
};

export default transformData;
