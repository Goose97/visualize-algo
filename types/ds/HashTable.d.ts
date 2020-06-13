// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate } from 'types';

export declare namespace HashTable {
  export interface Item {
    key: string;
    value: string | number;
  }

  export type Model = Item[];

  export type Api = 'insert' | 'delete';

  export type Method = 'insert' | 'delete';

  export interface InsertParams {
    key: string;
    value: number;
  }
}
