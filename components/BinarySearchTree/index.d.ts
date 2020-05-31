import { BaseMemoryBlockProps, ObjectType } from 'types';
import { Action } from 'types';
import { BST } from 'types/ds/BST';

export interface IState {
  nodeAboutToVisit: Set<number>;
  bstModel: BST.Model;
}

export interface IProps {
  x: number;
  y: number;
  currentStep?: number;
  totalStep?: number;
  instructions?: Action<BST.Method>[][];
  initialData: Array<number, null>;
  updateWhenDataChanges?: boolean;
  interactive?: boolean;
  handleExecuteApi?: (apiName: string, params?: ObjectType<any>) => void;
}

export interface NodeInLevelOrderTraversalQueue extends BST.NodeModel {
  x: number;
  y: number;
  level: number;
}

export type LevelOrderTraversalQueue = NodeInLevelOrderTraversalQueue[];
