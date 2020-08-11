import { last } from 'lodash';

import { Instructions } from 'instructions';
import { Graph } from 'types/ds/Graph';

export const graphInstruction = (
  data: Graph.Model,
  operation: Graph.Api,
  parameters: any,
) => {
  switch (operation) {
    case 'dfs':
      return dfsInstruction(data, parameters);

    case 'bfs':
      return bfsInstruction(data, parameters);

    default:
      return [];
  }
};

const dfsInstruction = (
  data: Graph.Model,
  { startAt }: Graph.TraversalParams,
) => {
  let instructions = new Instructions();
  // const codeLines = getCodeLine('dfs');

  // Start make instruction
  let stack: number[] = [];
  let visited: Set<number> = new Set([]);
  stack.push(startAt);
  instructions.pushActionsAndEndStep('stack', [
    { name: 'push', params: [startAt] },
  ]);

  while (stack.length) {
    // Check the node on top of the stack
    const lastNodeKey = last(stack);
    instructions.pushActions('graph', [{ name: 'resetHighlight', params: [] }]);
    instructions.pushActions('graph', [
      { name: 'focus', params: [lastNodeKey] },
    ]);

    // Highlight all adjacent nodes
    const adjacentNodes = data.find(({ key }) => key === lastNodeKey)!
      .adjacentNodes;
    adjacentNodes.forEach(nodeKey => {
      instructions.pushActions('graph', [
        { name: 'highlightEdge', params: [lastNodeKey, nodeKey] },
      ]);
      instructions.pushActions('graph', [
        { name: 'highlight', params: [nodeKey] },
      ]);
    });
    instructions.endStep();

    // Filter out nodes which are already in stack or visited
    const adjacentNodesWhichNotVisited = adjacentNodes.filter(
      key => !visited.has(key) && !stack.includes(key),
    );
    if (adjacentNodesWhichNotVisited.length) {
      // Still has node to push to stack
      adjacentNodesWhichNotVisited.forEach(key => {
        stack.push(key);
        instructions.pushActions('stack', [{ name: 'push', params: [key] }]);
      });
      instructions.endStep();
    } else {
      // Reach leaf node, pop it out
      const nodeKeyToPop = stack.pop();
      visited.add(nodeKeyToPop!);
      instructions.pushActions('stack', [{ name: 'pop', params: [] }]);
      instructions.pushActions('array', [
        { name: 'push', params: [nodeKeyToPop] },
      ]);
      instructions.pushActionsAndEndStep('graph', [
        { name: 'visited', params: [nodeKeyToPop] },
      ]);
    }
  }

  instructions.pushActionsAndEndStep('graph', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const bfsInstruction = (
  data: Graph.Model,
  { startAt }: Graph.TraversalParams,
) => {
  let instructions = new Instructions();
  // const codeLines = getCodeLine('bfs');

  // Start make instruction
  let queue: number[] = [];
  let visited: Set<number> = new Set([]);
  queue.push(startAt);
  instructions.pushActionsAndEndStep('queue', [
    { name: 'enqueue', params: [startAt] },
  ]);

  while (queue.length) {
    // Highlight all adjacent nodes
    const currentNodeKey = queue[0];
    const currentNode = data.find(({ key }) => key === currentNodeKey);
    const adjacentNodes = currentNode ? currentNode.adjacentNodes : [];
    instructions.pushActions('graph', [
      { name: 'focus', params: [currentNodeKey] },
    ]);
    instructions.pushActions('graph', [{ name: 'resetHighlight', params: [] }]);
    adjacentNodes.forEach(nodeKey => {
      instructions.pushActions('graph', [
        { name: 'highlight', params: [nodeKey] },
      ]);
      instructions.pushActions('graph', [
        { name: 'highlightEdge', params: [currentNodeKey, nodeKey] },
      ]);
    });
    instructions.endStep();

    // Push all adjacent nodes which are not visited or in queue to queue
    const adjacentNodesWhichNotVisited = adjacentNodes.filter(
      key => !visited.has(key) && !queue.includes(key),
    );
    adjacentNodesWhichNotVisited.forEach(key => {
      queue.push(key);
      instructions.pushActions('queue', [{ name: 'enqueue', params: [key] }]);
    });
    if (adjacentNodesWhichNotVisited.length) instructions.endStep();

    // Dequeue and mark the current node as visited, push current node to result array
    queue.shift();
    visited.add(currentNodeKey!);
    instructions.pushActions('queue', [{ name: 'dequeue', params: [] }]);
    instructions.pushActions('array', [
      { name: 'push', params: [currentNodeKey] },
    ]);
    instructions.pushActionsAndEndStep('graph', [
      { name: 'visited', params: [currentNodeKey] },
    ]);
  }

  instructions.pushActionsAndEndStep('graph', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

// const getCodeLine = (operation: Graph.Api): ObjectType<string> => {
//   switch (operation) {
//     default:
//       return {};
//   }
// };
