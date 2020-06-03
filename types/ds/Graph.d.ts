import { BaseMemoryBlockProps, ObjectType } from 'types';
import { IProps as GraphMemoryBlockProps } from 'components/GraphMemoryBlock/index.d';

export declare namespace Graph {
  export interface NodeModel extends GraphMemoryBlockProps {
    key: number;
    adjacentNodes: number[];
    visited?: boolean;
  }

  export type Model = NodeModel[];

  export type Api = '';

  export type Method = 'addEdge';
}
