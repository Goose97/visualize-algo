import produce from 'immer';
import { compose } from 'lodash/fp';

import { Graph } from 'types/ds/Graph';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformGraphModel = (
  currentModel: Graph.Model,
  operation: Graph.Method,
  payload: any[],
): Graph.Model => {
  switch (operation) {
    case 'addEdge': {
      const [nodeAKey, nodeBKey] = payload;
      return produce(currentModel, draft => {
        const nodeA = draft.find(({ key }) => key === nodeAKey);
        const nodeB = draft.find(({ key }) => key === nodeBKey);
        if (!nodeA || !nodeB) return;
        nodeA.adjacentNodes.push(nodeBKey);
        nodeB.adjacentNodes.push(nodeAKey);
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

    case 'visited': {
      const [keyToVisited] = payload;
      return produce(currentModel, draft => {
        const nodeToVisited = draft.find(({ key }) => key === keyToVisited);
        if (nodeToVisited) nodeToVisited.visited = true;
      });
    }

    case 'resetAll': {
      // Reset focus, visited and label
      const listTransformation = ([
        'resetFocus',
        'resetVisited',
        'resetLabel',
      ] as Graph.Method[]).map(method => (model: Graph.Model) =>
        transformGraphModel(model, method, []),
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

export default transformGraphModel;
