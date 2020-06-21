// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate } from 'types';

export declare namespace HashTable {
  export interface Key {
    key: string;
    value: string | number;
    isNew?: boolean;
    highlight?: boolean;
    address: number;
  }

  export interface MemoryAddress {
    key: number;
    values: Array<string | number>;
    highlight?: boolean;
  }

  export type Model = {
    keys: Key[];
    memoryAddresses: MemoryAddress[];
  };

  export type Api = 'insert' | 'delete';

  export type Method =
    | 'insert'
    | 'delete'
    | 'toggleIsNew'
    | 'insertKey'
    | 'updateKeyAddress'
    | 'insertValue'
    | 'highlightKey'
    | 'highlightAddress'
    | 'dehighlightAddress'
    | 'deleteKey'
    | 'deleteValue'
    | 'resetAll';

  export interface InsertParams {
    key: string;
    value: number;
    collisionResolution: 'chaining' | 'linearProbe';
  }
}
