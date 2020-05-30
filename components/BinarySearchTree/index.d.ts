import { BaseMemoryBlockProps, ObjectType } from 'types';
import { Action } from 'types';
import { BST } from 'types/ds/BST';

// interface BSTNodeModel extends BaseMemoryBlockProps {
//   x: number;
//   y: number;
//   key: number;
//   left: number | null; // holding key of left child
//   right: number | null; // // holding key of right child
//   visited?: boolean;
//   visible?: boolean;
//   aboutToDelete?: boolean;
//   isNew?: boolean;
// }

// export type BSTModel = BSTNodeModel[];

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