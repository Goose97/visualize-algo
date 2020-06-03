import produce from 'immer';

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

    default:
      return currentModel;
  }
};

export default transformGraphModel;
