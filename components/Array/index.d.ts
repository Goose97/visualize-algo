// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate, BaseDSProps, BaseMemoryBlockProps } from 'types';
import { Array } from 'types/ds/Array';

export interface IState {
  arrayModel: Array.Model;
  isVisible: boolean;
  sortingState: {
    currentSortingElementIndex?: number;
    currentSortingElementKey?: number;
  };
}

export interface IProps extends BaseDSProps {
  initialData: number[];
  instructions: Action<Array.Method>[][];
  blockType: string;
  currentApi?: Array.Api;
}

export interface ArrayMemoryBlockProps extends BaseMemoryBlockProps {
  index: number;
  visited?: boolean;
  blockType: string;
  className?: string;
  isInsertionSorting?: boolean;
}
