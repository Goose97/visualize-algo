// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate } from 'types';

export declare namespace Array {
  export interface Node {
    value: number | null;
    key: number;
    index: number;
    focus?: boolean;
    visited?: boolean;
    visible: boolean;
    label?: string[];
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
