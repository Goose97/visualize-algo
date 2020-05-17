import { BaseMemoryBlockProps } from 'types';

interface BSTNodeModel extends BaseMemoryBlockProps {
  key: number;
  left: number | null; // holding key of left child
  right: number | null; // // holding key of right child
}

export type BSTModel = BSTNodeModel[];

export interface NodeInLevelOrderTraversalQueue extends BSTNodeModel {
  x: number;
  y: number;
  level: number;
}

export type LevelOrderTraversalQueue = NodeInLevelOrderTraversalQueue[];
