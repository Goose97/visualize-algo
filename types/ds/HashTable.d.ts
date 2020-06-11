// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate } from 'types';

export declare namespace HashTable {
  export interface Item {
    key: string;
    value: string | number;
  }

  export type Model = Item[];

  export type Api = 'bubbleSort' | 'selectionSort' | 'insertionSort';

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

  export interface SortParams {}
}
