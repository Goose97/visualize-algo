import { LinkedListNodeModel } from '../LinkedList/index.d';
import { PointCoordinate, BaseMemoryBlockProps } from 'types';

export interface IProps {
  value: number | null;
  width: number;
  height: number;
  x: number;
  y: number;
  visited?: boolean;
  textOffset?: PointCoordinate;
  type: 'rectangle' | 'round';
}

export interface IState {
  isHiding?: boolean;
  isShowing?: boolean;
}
