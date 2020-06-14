// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate } from 'types';

export declare namespace HashTable {
  export interface Item {
    key: string;
    value: string | number;
    isNew?: boolean;
  }

  export type Model = Item[];

  export type Api = 'insert' | 'delete';

  export type Method = 'insert' | 'delete' | 'toggleIsNew';

  export interface InsertParams {
    key: string;
    value: number;
  }
}
