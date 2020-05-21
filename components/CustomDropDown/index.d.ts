export interface IProps {
  options: { label: React.ReactNode; value: number | string }[];
  onSelect?: (value: number | string) => void;
}
