import { LinkedListNodeModel } from '../LinkedList/index.d';

export interface IProps extends LinkedListNodeModel {
  value: number;
  name: string | number;
}

export interface IState {
  transformList: string[];
  isHiding?: boolean;
  isShowing?: boolean;
}
