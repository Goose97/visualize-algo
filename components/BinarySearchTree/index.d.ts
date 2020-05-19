import { BaseMemoryBlockProps } from 'types';
import { Action } from 'types';

interface BSTNodeModel extends BaseMemoryBlockProps {
  key: number;
  left: number | null; // holding key of left child
  right: number | null; // // holding key of right child
  visited?: boolean;
}

export type BSTModel = BSTNodeModel[];

export interface IState {
  nodeAboutToVisit: Set<number>;
  bstModel: BSTModel;
}

export interface IProps {
  x: number;
  y: number;
  currentStep: number;
  totalStep: number;
  instructions: Action<BSTMethod>[][];
  initialData: number[];
}

export interface NodeInLevelOrderTraversalQueue extends BSTNodeModel {
  x: number;
  y: number;
  level: number;
}

export type LevelOrderTraversalQueue = NodeInLevelOrderTraversalQueue[];

export type BSTMethod =
  | 'visit'
  | 'focus'
  | 'resetFocus'
  | 'label'
  | 'delete'
  | 'insert';
