import { IProps as MemoryBlockProps } from '../MemoryBlock/index.d';
import { PointCoordinate } from '../../types';

export interface ArrayNode {
  value: number;
  key: number;
  focus?: boolean;
  visited?: boolean;
}

export type ArrayModel = ArrayNode[];

export type ArrayMethod = 'swap';

export interface IState {
  arrayModel: ArrayModel;
}

export interface IProps {}

export interface ArrayMemoryBlockProps extends Partial<MemoryBlockProps> {
  value: number;
  index: number;
  origin: PointCoordinate;
}
