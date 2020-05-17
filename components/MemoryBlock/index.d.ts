import { LinkedListNodeModel } from '../LinkedList/index.d';
import { PointCoordinate, BaseMemoryBlockProps } from 'types';

export interface IProps extends BaseMemoryBlockProps {
  width: number;
  height: number;
  x: number;
  y: number;
  visited?: boolean;
  label?: string;
  textOffset?: PointCoordinate;
  type: 'rectangle' | 'round';
}

export interface IState {
  isHiding?: boolean;
  isShowing?: boolean;
}
