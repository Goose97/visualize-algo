import { WithExtendClassName } from '../../hocs/withExtendClassName';

export type IProps = {
  onChange?: (value: number | string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
} & WithExtendClassName;
