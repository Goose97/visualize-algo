import { last } from 'lodash';

import { Instructions } from 'instructions';
import { ObjectType } from 'types';
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
  const codeLines = getCodeLine('dfs');

  // Start make instruction
  let stack: number[] = [];
  let visited: Set<number> = new Set([]);
  stack.push(startAt);
  instructions.pushActionsAndEndStep('stack', [
    { name: 'push', params: [startAt] },
  ]);

  while (stack.length) {
    const lastNodeKey = last(stack);
    instructions.pushActionsAndEndStep('graph', [
      { name: 'focus', params: [lastNodeKey, true] },
    ]);
    const adjacentNodesWhichNotVisited = data
      .find(({ key }) => key === lastNodeKey)!
      .adjacentNodes.filter(key => !visited.has(key) && !stack.includes(key));

    if (adjacentNodesWhichNotVisited.length) {
      // Still has node to push to stack
      adjacentNodesWhichNotVisited.forEach(key => {
        stack.push(key);
        instructions.pushActionsAndEndStep('stack', [
          { name: 'push', params: [key] },
        ]);
      });
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
  const codeLines = getCodeLine('bfs');

  // Start make instruction
  let queue: number[] = [];
  let visited: Set<number> = new Set([]);
  let currentFocusNode: number | undefined;
  queue.push(startAt);

  while (queue.length) {
    const currentNodeKey = queue.shift();
    instructions.pushActions('queue', [{ name: 'dequeue', params: [] }]);

    if (currentFocusNode) {
      instructions.pushActions('array', [
        { name: 'push', params: [currentFocusNode] },
      ]);
      instructions.pushActions('graph', [
        { name: 'visited', params: [currentFocusNode] },
      ]);
    }
    visited.add(currentNodeKey!);

    instructions.pushActionsAndEndStep('graph', [
      { name: 'focus', params: [currentNodeKey] },
    ]);
    currentFocusNode = currentNodeKey;

    const currentNode = data.find(({ key }) => key === currentNodeKey);
    const adjacentNodes = currentNode ? currentNode.adjacentNodes : [];

    adjacentNodes
      .filter(key => !visited.has(key) && !queue.includes(key))
      .forEach(key => {
        queue.push(key);
        instructions.pushActionsAndEndStep('queue', [
          { name: 'enqueue', params: [key] },
        ]);
      });
  }

  if (currentFocusNode) {
    instructions.pushActions('array', [
      { name: 'push', params: [currentFocusNode] },
    ]);
    instructions.pushActionsAndEndStep('graph', [
      { name: 'resetFocus', params: [] },
      { name: 'visited', params: [currentFocusNode] },
    ]);
  }

  instructions.pushActionsAndEndStep('graph', [
    { name: 'resetAll', params: [] },
  ]);

  return instructions.get();
};

const getCodeLine = (operation: Graph.Api): ObjectType<string> => {
  switch (operation) {
    default:
      return {};
  }
};
