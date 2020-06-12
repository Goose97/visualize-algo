// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate, BaseDSProps, BaseMemoryBlockProps } from 'types';
import { HashTable } from 'types/ds/HashTable';

export interface IState {
  hashTableModel: HashTable.Model;
  isVisible: boolean;
}

export interface IProps extends BaseDSProps {
  initialData: Object;
  instructions: Action<HashTable.Method>[][];
  blockType: string;
}

export interface HashTableMemoryBlockProps extends BaseMemoryBlockProps {
  index: number;
  visited?: boolean;
  blockType: string;
  hasLine?: boolean;
}

export interface KeyListProps {
  hashTableModel: HashTable.Model;
}

export interface MemoryArrayProps {
  hashTableModel: HashTable.Model;
}

export interface HashIndicationArrowProps {
  hashTableModel: HashTable.Model;
}
