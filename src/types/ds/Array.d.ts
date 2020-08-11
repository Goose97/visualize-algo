// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate, BaseMemoryBlockProps } from 'types';

export declare namespace Array {
  export interface Node extends BaseMemoryBlockProps {
    key: number;
    index: number;
    visited?: boolean;
  }

  export type Model = Node[];

  export type Api = 'bubbleSort' | 'selectionSort' | 'insertionSort';

  export type Method =
    | 'swap'
    | 'focus'
    | 'resetFocus'
    | 'resetFocusAll'
    | 'complete'
    | 'label'
    | 'unlabel'
    | 'unlabelAll'
    | 'setValue'
    | 'setIndex'
    | 'push'
    | 'highlight'
    | 'dehighlight'
    | 'dehighlightAll'
    | 'resetAll';

  export interface SortParams {}
}
