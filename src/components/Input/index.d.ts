import { WithExtendClassName } from '../../hocs/withExtendClassName';

export type IProps = {
  onChange?: (value: number | string) => void;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  status?: 'normal' | 'warning' | 'error' | 'success';
} & WithExtendClassName;
