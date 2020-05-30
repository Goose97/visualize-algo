// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate } from '../../types';

export interface ArrayNode {
  value: number | null;
  key: number;
  index: number;
  focus?: boolean;
  visited?: boolean;
  visible: boolean;
  label?: string;
  hasLine?: boolean;
}

export type ArrayModel = ArrayNode[];

export type ArrayMethod =
  | 'swap'
  | 'focus'
  | 'resetFocus'
  | 'resetFocusAll'
  | 'complete'
  | 'label'
  | 'unlabel'
  | 'setValue'
  | 'setLine'
  | 'push';

export interface IState {
  arrayModel: ArrayModel;
}

export interface IProps {
  initialData: number[];
  currentStep: number;
  totalStep: number;
  instructions: Action[][];
  blockType: string;
}

export interface ArrayMemoryBlockProps {
  value: number | null;
  index: number;
  origin: PointCoordinate;
  visible?: boolean;
  focus?: boolean;
  visited?: boolean;
  label?: string;
  blockType: string;
}
