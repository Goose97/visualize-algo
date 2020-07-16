import {
  Action,
  DataStructureMethod,
  BaseMemoryBlockProps,
  BaseDSProps,
} from 'types';
import { LinkedList } from 'types/ds/LinkedList';
import { WithReverseStep } from '../../hocs/withReverseStep';
import { IProps as PointerLinkProps } from 'components/PointerLink/index.d';

export interface IProps extends BaseDSProps {
  instructions: Action<LinkedList.Method>[][];
  initialData?: Array<number | string>;
  data?: Array<number | string>;
  headArrowVisible?: boolean;
}

export interface IState {
  nodeAboutToAppear: Set<number>;
  nodeAboutToVisit?: number;
}

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
