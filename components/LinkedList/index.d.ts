import { Action, DataStructureMethod } from 'types';
import { WithReverseStep } from '../../hocs/withReverseStep';
import { IProps as PointerLinkProps } from 'components/PointerLink/index.d';

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
  label?: string[];
  pointer: number | null; // pointer to the next node
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
  linkedListModel: LinkedListModel;
  nodeAboutToAppear: Set<number>;
  nodeAboutToVisit?: number;
  isVisible: boolean;
}

export type LinkedListNormalMethod =
  | 'add'
  | 'remove'
  | 'visit'
  | 'focus'
  | 'label'
  | 'changePointer';
export type LinkedListReverseMethod =
  | 'reverseAdd'
  | 'reverseRemove'
  | 'reverseVisit'
  | 'reverseFocus';
export type LinkedListMethod = LinkedListNormalMethod | LinkedListReverseMethod;

export type LinkedListDataStructure = Record<
  LinkedListNormalMethod,
  DataStructureMethod<LinkedListModel>
>;

export type LinkedListPointerProps = {
  linkedListModel: LinkedListModel;
  nodeAboutToAppear: Set<number>;
  from: number;
  to: number | null;
} & Omit<PointerLinkProps, 'path'>;

export interface LinkedListMemoryBlockProps {
  value: number;
  x: number;
  y: number;
  visible?: boolean;
  visited?: boolean;
  focus?: boolean;
  label?: string;
}
