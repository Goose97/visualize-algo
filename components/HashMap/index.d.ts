// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate, BaseDSProps, BaseMemoryBlockProps } from 'types';
import { HashMap } from 'types/ds/HashMap';

export interface IState {
  hashMapModel: HashMap.Model;
  isVisible: boolean;
}

export interface IProps extends BaseDSProps {
  initialData: number[];
  instructions: Action<HashMap.Method>[][];
  blockType: string;
}

export interface HashMapMemoryBlockProps extends BaseMemoryBlockProps {
  index: number;
  visited?: boolean;
  blockType: string;
  hasLine?: boolean;
}
