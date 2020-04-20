export interface IProps {
  className?: string;
  onChange?: (value: number | string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
}