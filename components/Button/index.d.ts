export interface IProps {
  type: 'primary' | 'secondary';
  disabled: boolean;
  onClick: React.MouseEventHandler;
  style: React.CSSProperties;
}
