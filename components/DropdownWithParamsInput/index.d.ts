import { ObjectType } from 'types';

interface Option {
  label: string;
  value: string;
}

type ParamsType = ObjectType<string>;

export interface IProps {
  options: Option[];
  requiredApiParams?: ObjectType<ParamsType>;
  handler?: (apiName: string, params?: ObjectType<any>) => void;
}

export interface IState {
  isMenuVisible: boolean;
}
