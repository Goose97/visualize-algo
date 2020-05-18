import { Action, DataStructureMethod, BaseMemoryBlockProps } from 'types';
import { WithReverseStep } from '../../hocs/withReverseStep';
import { IProps as PointerLinkProps } from 'components/PointerLink/index.d';

export type LinkedListModel = LinkedListNodeModel[];
export interface LinkedListNodeModel extends BaseMemoryBlockProps {
  x: number;
  y: number;
  index: number;
  key: number;
  visited: boolean;
  label?: string[];
  pointer: number | null; // pointer to the next node
}

export interface IProps {
  x: number;
  y: number;
  currentStep: number;
  totalStep: number;
  instructions: Action<LinkedListMethod>[][];
  initialData: number[];
}

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

export type LinkedListPointerProps = Pick<
  PointerLinkProps,
  'following' | 'visited' | 'visible' | 'arrowDirection'
> & {
  linkedListModel: LinkedListModel;
  nodeAboutToAppear: Set<number>;
  from: number;
  to: number | null;
};

export interface LinkedListMemoryBlockProps extends BaseMemoryBlockProps {
  x: number;
  y: number;
  visited?: boolean;
  label?: string;
}
