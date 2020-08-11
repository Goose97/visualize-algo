import { BaseMemoryBlockProps } from 'types';

export declare namespace Stack {
  export interface ItemModel extends BaseMemoryBlockProps {
    key: number;
    offsetFromFront: number;
    isNew?: boolean;
  }

  export type Model = ItemModel[];

  export type Api = 'push' | 'pop';

  export type Method = 'push' | 'pop';
}
