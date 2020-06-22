// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate, BaseDSProps, BaseMemoryBlockProps } from 'types';
import { Array } from 'types/ds/Array';

export interface IState {
  arrayModel: Array.Model;
  isVisible: boolean;
  insertionSort: {
    currentSortingElementIndex?: number;
    currentSortingElementValue?: number | string | null;
  };
}

export interface IProps extends BaseDSProps {
  initialData: number[];
  instructions: Action<Array.Method>[][];
  blockType: string;
}

export interface ArrayMemoryBlockProps extends BaseMemoryBlockProps {
  index: number;
  visited?: boolean;
  blockType: string;
  className?: string;
}
