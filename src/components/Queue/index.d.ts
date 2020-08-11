import { PointCoordinate, BaseMemoryBlockProps, BaseDSProps } from 'types';
import { Queue } from 'types/ds/Queue';

export interface IProps extends BaseDSProps {
  instructions: Action[][];
  initialData: number[];
}

export interface IState {
  queueModel: Queue.Model;
}

export type QueueMethod = 'dequeue' | 'enqueue';

export interface QueueItemProps extends Queue.ItemModel {
  isNew?: boolean;
}

export interface QueueItemState {
  isAboutToDisappear?: boolean;
}
