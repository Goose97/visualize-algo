import produce from 'immer';

import { ArrayModel, ArrayMethod } from './index.d';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformArrayModel = (
  currentModel: ArrayModel,
  operation: ArrayMethod,
  payload: any[]
): ArrayModel => {
  switch (operation) {
    case 'swap': {
      const [from, to] = payload;
      return produce(currentModel, draft => {
        const fromNode = draft.find(({ key }) => key === from);
        const toNode = draft.find(({ key }) => key === to);
        if (fromNode && toNode) {
          const temp = fromNode.index;
          fromNode.index = toNode.index;
          toNode.index = temp;
        }
      });
    }

    case 'focus': {
      const [keyToFocus] = payload;
      return produce(currentModel, draft => {
        const nodeToFocus = draft.find(({ key }) => key === keyToFocus);
        if (nodeToFocus) {
          nodeToFocus.focus = true;
        }
      });
    }

    case 'resetFocus': {
      const [keyToResetFocus] = payload;
      return produce(currentModel, draft => {
        const nodeToResetFocus = draft.find(
          ({ key }) => key === keyToResetFocus
        );
        if (nodeToResetFocus) {
          nodeToResetFocus.focus = false;
        }
      });
    }

    case 'resetFocusAll': {
      return produce(currentModel, draft => {
        draft.forEach(node => {
          node.focus = false;
        });
      });
    }

    case 'complete': {
      const [keyToComplete] = payload;
      return produce(currentModel, draft => {
        const nodeToComplete = draft.find(({ key }) => key === keyToComplete);
        if (nodeToComplete) {
          nodeToComplete.visited = true;
        }
      });
    }

    case 'label': {
      const [keyToLabel, label] = payload;
      return produce(currentModel, draft => {
        const nodeToLabel = draft.find(({ key }) => key === keyToLabel);
        if (nodeToLabel) {
          nodeToLabel.label = label;
        }
      });
    }

    case 'unlabel': {
      const [keyToUnlabel] = payload;
      return produce(currentModel, draft => {
        const nodeToUnlabel = draft.find(({ key }) => key === keyToUnlabel);
        if (nodeToUnlabel) {
          nodeToUnlabel.label = undefined;
        }
      });
    }

    case 'setValue': {
      const [keyToResetValue, value] = payload;
      return produce(currentModel, draft => {
        const nodeToResetValue = draft.find(
          ({ key }) => key === keyToResetValue
        );
        if (nodeToResetValue) {
          nodeToResetValue.value = value;
          // nodeToValue.value = 0;
        }
      });
    }

    case 'setLine': {
      const [keyToSetLine] = payload;
      return produce(currentModel, draft => {
        const nodeToSetLine = draft.find(({ key }) => key === keyToSetLine);
        draft.forEach(node => (node.hasLine = false));
        if (nodeToSetLine) {
          nodeToSetLine.hasLine = true;
        }
      });
    }

    case 'push': {
      const [newArrayNode] = payload;
      return produce(currentModel, draft => {
        draft.push(newArrayNode);
      });
    }

    default:
      return currentModel;
  }
};

export default transformArrayModel;
