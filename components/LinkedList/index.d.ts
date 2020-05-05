import { Action } from 'types';
import { WithReverseStep } from '../../hocs/withReverseStep';

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
  label?: string;
}

export type IProps = {
  x: number;
  y: number;
  currentStep: number;
  totalStep: number;
  instructions: Action[][];
  currentState: any;
  fullState: any;
  initialData: number[];
} & WithReverseStep;

export interface IState {
  blockInfo: LinkedListModel;
  nodeAboutToAppear: Set<number>;
  nodeAboutToVisit?: number;
  isVisible: boolean;
}

export type LinkedListNormalMethod = 'add' | 'remove' | 'visit' | 'focus' | 'label';
export type LinkedListReverseMethod =
  | 'reverseAdd'
  | 'reverseRemove'
  | 'reverseVisit'
  | 'reverseFocus'
  | 'reverseLabel';
export type LinkedListMethod = LinkedListNormalMethod | LinkedListReverseMethod;
