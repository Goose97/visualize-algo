import { Instructions } from 'instructions';
import { initLinkedList } from './helper';
import { ObjectType } from 'types';
import { Graph } from 'types/ds/Graph';
import { LinkedListNode } from './helper';

export const graphInstruction = (
  data: Graph.Model,
  operation: Graph.Api,
  parameters: any,
) => {
  switch (operation) {
    case 'dfs':
      return dfsInstruction(data, parameters);

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
  let currentFocusNode: number | undefined;
  stack.push(startAt);

  while (stack.length) {
    const currentNodeKey = stack.pop();
    instructions.pushActions('stack', [{ name: 'pop', params: [] }]);

    if (currentFocusNode)
      instructions.pushActions('graph', [
        { name: 'visited', params: [currentFocusNode] },
      ]);
    visited.add(currentNodeKey!);

    instructions.pushActionsAndEndStep('graph', [
      { name: 'focus', params: [currentNodeKey] },
    ]);
    currentFocusNode = currentNodeKey;

    const currentNode = data.find(({ key }) => key === currentNodeKey);
    const adjacentNodes = currentNode ? currentNode.adjacentNodes : [];

    adjacentNodes
      .filter(key => !visited.has(key) && !stack.includes(key))
      .forEach(key => {
        stack.push(key);
        instructions.pushActionsAndEndStep('stack', [
          { name: 'push', params: [key] },
        ]);
      });
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
