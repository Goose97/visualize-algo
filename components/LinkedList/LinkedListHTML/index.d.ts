import { ObjectType } from 'types';

export interface LinkedListNodeApiDropdownProps {
  nodeKey: number;
  onSearch: (params: ObjectType<any>) => void;
  onInsert: (params: ObjectType<any>) => void;
  onDelete: (params: ObjectType<any>) => void;
}

export interface LinkedListNodeApiDropdownState {
  isMenuVisible: boolean;
}

export interface LinkedListApiDropdownProps {
  onSearch: (params: ObjectType<any>) => void;
  onInsert: (params: ObjectType<any>) => void;
  onDelete: (params: ObjectType<any>) => void;
}

export interface LinkedListApiDropdownState {
  isMenuVisible: boolean;
}
