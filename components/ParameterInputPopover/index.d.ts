import { PopoverProps } from 'antd/lib/popover/index.d';
import { ObjectType } from 'types';

export interface IProps extends PopoverProps {
  parameters?: ObjectType<'number' | 'string'>;
  onSubmit?: (parameters: Object) => void;
}

export interface IState {
  currentParametersInput: Object;
}
