export interface IProps {
  onChange: (value: number[]) => void;
}

export interface IState {
  input: number[];
  error: string | null;
}
