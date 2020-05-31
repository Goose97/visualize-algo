import { BaseMemoryBlockProps, ObjectType } from 'types';
import { Action, BaseDSProps } from 'types';
import { BST } from 'types/ds/BST';

export interface IState {
  nodeAboutToVisit: Set<number>;
  bstModel: BST.Model;
  isVisible: boolean;
}

export interface IProps extends BaseDSProps {
  instructions?: Action<BST.Method>[][];
  initialData: Array<number, null>;
}

export interface NodeInLevelOrderTraversalQueue extends BST.NodeModel {
  x: number;
  y: number;
  level: number;
}

export type LevelOrderTraversalQueue = NodeInLevelOrderTraversalQueue[];
