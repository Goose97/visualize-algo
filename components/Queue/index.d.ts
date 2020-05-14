import { PointCoordinate } from '../../types';

export type QueueModel = QueueItemModel[];

export interface QueueItemModel {
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
  queueModel: QueueModel;
}

export type QueueMethod = 'dequeue' | 'enqueue';

export interface QueueItemProps extends QueueItemModel {
  origin: PointCoordinate;
  isNew?: boolean;
}

export interface QueueItemState {
  isAboutToDisappear?: boolean;
}
