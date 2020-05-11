import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate } from '../../types';

export interface ArrayNode {
  value: number;
  key: number;
  index: number;
  focus?: boolean;
  visited?: boolean;
  visible: boolean;
}

export type ArrayModel = ArrayNode[];

export type ArrayMethod = 'swap';

export interface IState {
  arrayModel: ArrayModel;
}

export interface IProps {
  initialData: number[];
  currentStep: number;
  totalStep: number;
}

export interface ArrayMemoryBlockProps {
  value: number;
  index: number;
  origin: PointCoordinate;
  visible?: boolean;
}
