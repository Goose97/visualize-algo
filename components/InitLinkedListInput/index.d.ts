export interface IProps {
  onChange?: (value: number[]) => void;
  onSubmit: (value: number[]) => void;
}

export interface IState {
  input: number[];
  error: string | null;
  isTyping: boolean;
}
