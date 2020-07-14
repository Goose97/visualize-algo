import { ObjectType } from 'types';
import { HashTable } from 'types/ds';

export interface IProps {
  onChange?: (value: number[]) => void;
  onSubmit: (
    value: ObjectType<string | number>,
    collisionResolution: HashTable.CollisionResolution,
  ) => void;
}

export interface IState {
  textInput?: string;
  input: ObjectType<string | number>;
  error: string | null;
  isModalVisible: boolean;
  collisionResolution: HashTable.CollisionResolution;
}
