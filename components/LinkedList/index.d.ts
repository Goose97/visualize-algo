import { Action } from 'types';
import { LinkedListOperation } from 'instructions/LinkedList/index.d';

export type LinkedListModel = LinkedListNodeModel[];
export interface LinkedListNodeModel {
  x: number;
  y: number;
  value: number;
  index: number;
  key: number;
  visible: boolean;
  visited: boolean;
  focus: boolean;
}

export interface IProps {
  x: number;
  y: number;
  currentStep: number;
  totalStep: number;
  instructions: Action[][];
  currentState: any;
  fullState: any;
  initialData: number[];
}

export interface IState {
  blockInfo: LinkedListModel;
  nodeAboutToAppear: Set<number>;
  nodeAboutToVisit?: number;
  isVisible: boolean;
}

type LinkedListReverseMethod =
  | 'reverseInsert'
  | 'reverseDelete'
  | 'reverseVisit'
  | 'reverseFocus';

export type LinkedListMethod = LinkedListOperation | LinkedListReverseMethod;
