import { PointCoordinate } from '../../types';

export interface IProps {
  origin: PointCoordinate;
}

export interface IState {
  transformSequence: string[];
}

export interface TransformationChange {
  amount: number;
  direction: 'horizontal' | 'vertical';
}
