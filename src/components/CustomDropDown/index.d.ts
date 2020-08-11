import { DropDownProps } from 'antd/lib/dropdown/index.d';

export interface IProps extends Omit<DropDownProps, 'overlay'> {
  options: { label: React.ReactNode; value: number | string }[];
  onSelect?: (value: number | string) => void;
  overlay?: React.ReactElement;
}
