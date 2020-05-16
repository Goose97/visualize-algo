import { PointCoordinate } from '../../types';

export type StackModel = StackItemModel[];

export interface StackItemModel {
  value: number;
  focus?: boolean;
  visible?: boolean;
  key: number;
  offsetFromFront: number;
  isNew?: boolean;
}

export interface IProps {
  x: number;
  y: number;
  currentStep: number;
  totalStep: number;
  instructions: Action[][];
  initialData: number[];
}

export interface IState {
  stackModel: StackModel;
}

export type StackMethod = 'push' | 'pop';

export interface StackItemProps extends StackItemModel {
  origin: PointCoordinate;
  isNew?: boolean;
}

export interface StackItemState {
  isAboutToDisappear?: boolean;
}
