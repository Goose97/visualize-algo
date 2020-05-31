import { BaseMemoryBlockProps } from 'types';

export declare namespace LinkedList {
  export interface NodeModel extends BaseMemoryBlockProps {
    x: number;
    y: number;
    index: number;
    key: number;
    visited: boolean;
    pointer: number | null; // pointer to the next node
  }

  export type Model = NodeModel[];

  export type Api = 'search' | 'insert' | 'delete' | 'reverse' | 'detectCycle';

  export interface SearchParams {
    value: number;
  }

  export interface InsertParams {
    value: number;
    index: number;
  }

  export interface DeleteParams {
    index: number;
  }

  export type Method =
    | 'insert'
    | 'remove'
    | 'visit'
    | 'visited'
    | 'focus'
    | 'label'
    | 'changePointer'
    | 'resetFocus'
    | 'resetVisited'
    | 'resetLabel'
    | 'resetAll';
}
