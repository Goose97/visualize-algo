import produce from 'immer';
import { uniq } from 'lodash';
import { compose } from 'lodash/fp';

import { Array } from 'types/ds/Array';

const swapObjectProperty = (objectA: any, objectB: any, property: string) => {
  const tmp = objectA[property];
  objectA[property] = objectB[property];
  objectB[property] = tmp;
};

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformArrayModel = (
  currentModel: Array.Model,
  operation: Array.Method,
  payload: any[],
): Array.Model => {
  switch (operation) {
    case 'swap': {
      const [from, to] = payload;
      return produce(currentModel, draft => {
        const fromNode = draft.find(({ key }) => key === from);
        const toNode = draft.find(({ key }) => key === to);
        if (fromNode && toNode) {
          swapObjectProperty(fromNode, toNode, 'index');
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

    case 'unlabelAll': {
      return produce(currentModel, draft => {
        draft.forEach(item => (item.label = undefined));
      });
    }

    case 'setValue': {
      const [keyToSetValue, value] = payload;
      return produce(currentModel, draft => {
        const nodeToResetValue = draft.find(({ key }) => key === keyToSetValue);
        if (nodeToResetValue) nodeToResetValue.value = value;
      });
    }

    case 'setIndex': {
      const [keyToSetIndex, index] = payload;
      return produce(currentModel, draft => {
        const nodeToResetValue = draft.find(({ key }) => key === keyToSetIndex);
        if (nodeToResetValue) nodeToResetValue.index = index;
      });
    }

    case 'push': {
      const [newArrayNode] = payload;
      return produce(currentModel, draft => {
        draft.push(newArrayNode);
      });
    }

    // Highlight target key and blur every other key
    case 'highlight': {
      const [keyToHighlight] = payload;
      return produce(currentModel, draft => {
        const arrayNode = draft.find(({ key }) => key === keyToHighlight);
        if (arrayNode) arrayNode.highlight = true;
        draft.forEach(item => {
          item.blur = !item.highlight;
        });
      });
    }

    case 'dehighlight': {
      const [keyToDehighlight] = payload;
      return produce(currentModel, draft => {
        const arrayNode = draft.find(({ key }) => key === keyToDehighlight);
        if (arrayNode) arrayNode.highlight = false;
      });
    }

    case 'dehighlightAll': {
      return produce(currentModel, draft => {
        draft.forEach(item => {
          item.highlight = false;
          item.blur = false;
        });
      });
    }

    case 'resetAll': {
      // Reset focus, visited and label
      const listTransformation = ([
        'resetFocusAll',
        'dehighlightAll',
        'unlabelAll',
      ] as Array.Method[]).map(method => (model: Array.Model) =>
        transformArrayModel(model, method, []),
      );
      return compose(listTransformation)(currentModel);
    }

    default:
      return currentModel;
  }
};

export default transformArrayModel;
