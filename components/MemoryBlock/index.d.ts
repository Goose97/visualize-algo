import { LinkedListNodeModel } from '../LinkedList/index.d';

export interface IProps extends Omit<LinkedListNodeModel, 'key'> {
  value: number;
  name: string | number;
  width: number;
  height: number;
}

export interface IState {
  isHiding?: boolean;
  isShowing?: boolean;
}
