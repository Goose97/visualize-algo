// import { IProps as MemoryBlockProps } from '../MemoryBlock';
import { PointCoordinate } from 'types';
import { Array } from 'types/ds/Array'

export interface IState {
  arrayModel: Array.Model;
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
  label?: string[];
  blockType: string;
  hasLine?: boolean;
}