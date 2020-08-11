import { BaseMemoryBlockProps, ObjectType } from 'types';
import { IProps as GraphMemoryBlockProps } from 'components/GraphMemoryBlock/index.d';

export declare namespace Graph {
  export interface NodeModel extends GraphMemoryBlockProps {
    key: number;
    adjacentNodes: number[];
    visited?: boolean;
    highlightEdges?: number[];
  }

  export type Model = NodeModel[];

  export type Api = 'dfs' | 'bfs';

  export type Method =
    | 'addEdge'
    | 'focus'
    | 'visited'
    | 'resetAll'
    | 'highlight'
    | 'highlightEdge'
    | 'resetFocus'
    | 'resetLabel'
    | 'resetVisited'
    | 'resetHighlight';

  export interface TraversalParams {
    startAt: number;
  }
}
