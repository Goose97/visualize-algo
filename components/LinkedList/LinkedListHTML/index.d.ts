import { ObjectType, PointCoordinate } from 'types';

export interface LinkedListNodeApiDropdownProps {
  nodeKey: number;
  handler?: (apiName: string, params: ObjectType<any>) => void;
  coordinate: PointCoordinate;
  scale?: number;
}

export interface LinkedListNodeApiDropdownState {
  isMenuVisible: boolean;
}
