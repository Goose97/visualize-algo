// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate, BaseMemoryBlockProps } from 'types';

export declare namespace Array {
  export interface Node extends BaseMemoryBlockProps {
    key: number;
    index: number;
    visited?: boolean;
    hasLine?: boolean;
  }

  export type Model = Node[];

  export type Api = 'bubbleSort' | 'selectionSort' | 'insertionSort';

  export interface SortParams {};

  export type Method =
    | 'swap'
    | 'focus'
    | 'resetFocus'
    | 'resetFocusAll'
    | 'complete'
    | 'label'
    | 'unlabel'
    | 'setValue'
    | 'setLine'
    | 'push';
}
