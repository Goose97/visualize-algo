import { LinkedListNodeModel } from '../LinkedList/index.d';

export interface IProps extends Omit<LinkedListNodeModel, 'key'> {
  value: number;
  name: string | number;
}

export interface IState {
  isHiding?: boolean;
  isShowing?: boolean;
}
