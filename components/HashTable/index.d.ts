// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import {
  PointCoordinate,
  BaseDSProps,
  BaseMemoryBlockProps,
  ObjectType,
  StepInstruction,
  Action,
} from 'types';
import { HashTable } from 'types/ds/HashTable';
import { LinkedList } from 'types/ds/LinkedList';

export interface IState {
  hashTableModel: HashTable.Model;
  isVisible: boolean;
  keyAboutToBeAdded: string[];
  keyAboutToBeDeleted: string[];
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
  keyAboutToBeDeleted: string[];
}

export interface MemoryArrayState {
  linkedListInstructionAndStep: ObjectType<{
    instructions?: Action<LinkedList.Method>[][];
    currentStep?: number;
  }>;
}

export interface HashIndicationArrowProps {
  hashTableModel: HashTable.Model;
  onAnimationEnd: (key: string, animationName: string) => void;
  keyAboutToBeDeleted: string[];
  keyAboutToBeAdded: string[];
}