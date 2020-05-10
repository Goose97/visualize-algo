import { LinkedListNodeModel } from '../LinkedList/index.d';
import { PointCoordinate } from 'types';

export interface IProps {
  value: number;
  width: number;
  height: number;
  x: number;
  y: number;
  visible?: boolean;
  visited?: boolean;
  focus?: boolean;
  label?: string;
  textOffset?: PointCoordinate;
}

export interface IState {
  isHiding?: boolean;
  isShowing?: boolean;
}
