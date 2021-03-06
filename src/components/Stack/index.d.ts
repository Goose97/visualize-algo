import { PointCoordinate, BaseMemoryBlockProps, BaseDSProps } from 'types';
import { Stack } from 'types/ds/Stack';

export interface IProps extends BaseDSProps {
  instructions: Action<Stack.Method>[][];
  initialData: number[];
}

export interface IState {
  stackModel: Stack.Model;
}

export interface StackItemProps extends Stack.ItemModel {
  isNew?: boolean;
}

export interface StackItemState {
  isAboutToDisappear?: boolean;
}
