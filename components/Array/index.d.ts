// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate } from '../../types';

export interface ArrayNode {
  value: number;
  key: number;
  index: number;
  focus?: boolean;
  visited?: boolean;
  visible: boolean;
  label?: string;
}

export type ArrayModel = ArrayNode[];

export type ArrayMethod =
  | 'swap'
  | 'focus'
  | 'resetFocus'
  | 'resetFocusAll'
  | 'complete'
  | 'label'
  | 'unlabel';

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
  value: number;
  index: number;
  origin: PointCoordinate;
  visible?: boolean;
  focus?: boolean;
  visited?: boolean;
  label?: string;
  blockType: string;
}
