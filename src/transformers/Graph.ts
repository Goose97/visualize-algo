import produce from 'immer';
import { uniq } from 'lodash';
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
        nodeA.adjacentNodes = uniq(nodeA.adjacentNodes);
        nodeB.adjacentNodes.push(nodeAKey);
        nodeB.adjacentNodes = uniq(nodeB.adjacentNodes);
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

    case 'highlight': {
      const [keyToHighlight] = payload;
      return produce(currentModel, draft => {
        const listKey = Array.isArray(keyToHighlight)
          ? keyToHighlight
          : [keyToHighlight];
        listKey.forEach(item => {
          const nodeToHighlight = draft.find(({ key }) => key === item);
          if (nodeToHighlight) nodeToHighlight.circleAround = true;
        });
      });
    }

    case 'highlightEdge': {
      const [from, to] = payload;
      return produce(currentModel, draft => {
        const fromNode = draft.find(({ key }) => key === from);
        const toNode = draft.find(({ key }) => key === to);
        if (!fromNode || !toNode) return;

        {
          const oldHighlightEdges = fromNode.highlightEdges || [];
          const newHighlightEdges = uniq(oldHighlightEdges.concat(to));
          fromNode.highlightEdges = newHighlightEdges;
        }

        {
          const oldHighlightEdges = toNode.highlightEdges || [];
          const newHighlightEdges = uniq(oldHighlightEdges.concat(from));
          toNode.highlightEdges = newHighlightEdges;
        }
      });
    }

    case 'resetAll': {
      // Reset focus, visited and label
      const listTransformation = ([
        'resetFocus',
        'resetVisited',
        'resetLabel',
        'resetHighlight',
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

    case 'resetHighlight': {
      // reset highlight of node and edges
      return produce(currentModel, draft => {
        draft.forEach(item => {
          item.circleAround = false;
          item.highlightEdges = [];
        });
      });
    }

    default:
      return currentModel;
  }
};

export default transformGraphModel;
