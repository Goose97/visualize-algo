import produce from 'immer';
import { uniq } from 'lodash';

import { HashMap } from 'types/ds/HashMap';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformHashMapModel = (
  currentModel: HashMap.Model,
  operation: HashMap.Method,
  payload: any[],
): HashMap.Model => {
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
          ({ key }) => key === keyToResetFocus,
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
      const [nodeKeyToLabel, label, removeThisLabelInOtherNode] = payload;
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
          nodeToLabel.label = uniq(oldLabel.concat(label));
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
          ({ key }) => key === keyToResetValue,
        );
        if (nodeToResetValue) nodeToResetValue.value = value;
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
      const [newHashMapNode] = payload;
      return produce(currentModel, draft => {
        draft.push(newHashMapNode);
      });
    }

    default:
      return currentModel;
  }
};

export default transformHashMapModel;
