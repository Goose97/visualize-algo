import { BaseMemoryBlockProps, ObjectType } from 'types';
import { IProps as GraphMemoryBlockProps } from 'components/GraphMemoryBlock/index.d';

export declare namespace BST {
  export interface NodeModel extends GraphMemoryBlockProps {
    key: number;
    left: number | null; // holding key of left child
    right: number | null; // // holding key of right child
    visited?: boolean;
  }

  export type Model = NodeModel[];

  export type Api = 'search' | 'insert' | 'delete';

  export type Method =
    | 'visit'
    | 'focus'
    | 'resetFocus'
    | 'label'
    | 'delete'
    | 'insert'
    | 'focusToDelete'
    | 'setValue'
    | 'resetVisited'
    | 'resetLabel'
    | 'resetAll';

  export interface SearchParams {
    value: number | string;
  }

  export interface InsertParams {
    value: number | string;
  }

  export interface DeleteParams {
    value: number | string;
  }

  export type InputData = Array<number | null> | Array<number | string>;
}
