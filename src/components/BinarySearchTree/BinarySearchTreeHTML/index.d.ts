import { PointCoordinate } from "types";

export interface BSTNodeApiDropdownProps {
  value: number | string | null;
  handler?: (apiName: string, params: ObjectType<any>) => void;
  coordinate: PointCoordinate;
  scale: number;
}

export interface BSTNodeApiDropdownState {
  isMenuVisible: boolean;
}
