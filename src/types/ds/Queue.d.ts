import { BaseMemoryBlockProps } from 'types';

export declare namespace Queue {
  export interface ItemModel extends BaseMemoryBlockProps {
    key: number;
    offsetFromFront: number;
    isNew?: boolean;
  }

  export type Model = ItemModel[];

  export type Api = 'enqueue' | 'dequeue';

  export type Method = 'enqueue' | 'dequeue';
}
