export interface BSTNodeApiDropdownProps {
  value: number | string;
  handler?: (apiName: string, params: ObjectType<any>) => void;
}

export interface BSTNodeApiDropdownState {
  isMenuVisible: boolean;
}

export interface BSTApiDropdownProps {
  onSearch: (params: ObjectType<any>) => void;
  onInsert: (params: ObjectType<any>) => void;
  onDelete: (params: ObjectType<any>) => void;
}

export interface BSTApiDropdownState {
  isMenuVisible: boolean;
}
