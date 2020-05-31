import { Action, DataStructureMethod, BaseMemoryBlockProps } from 'types';
import { LinkedList } from 'types/ds/LinkedList';
import { WithReverseStep } from '../../hocs/withReverseStep';
import { IProps as PointerLinkProps } from 'components/PointerLink/index.d';

export interface IProps {
  x: number;
  y: number;
  currentStep: number;
  totalStep: number;
  instructions: Action<LinkedList.Method>[][];
  initialData: number[];
  interactive?: boolean;
  handleExecuteApi?: (apiName: string, params?: ObjectType<any>) => void;
}

export interface IState {
  linkedListModel: LinkedList.Model;
  nodeAboutToAppear: Set<number>;
  nodeAboutToVisit?: number;
  isVisible: boolean;
}

export type LinkedListDataStructure = Record<
  LinkedListNormalMethod,
  DataStructureMethod<LinkedList.Model>
>;

export type LinkedListPointerProps = Pick<
  PointerLinkProps,
  'following' | 'visited' | 'visible' | 'arrowDirection'
> & {
  linkedListModel: LinkedList.Model;
  nodeAboutToAppear: Set<number>;
  from: number;
  to: number | null;
};

export interface LinkedListMemoryBlockProps extends BaseMemoryBlockProps {
  x: number;
  y: number;
  visited?: boolean;
  isNew?: boolean;
}

export interface LinkedListHTMLProps {
  wrapperElement: SVGGElement;
  linkedListModel: LinkedList.Model;
}
