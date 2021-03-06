export interface IProps {
  onChange?: (value: number[]) => void;
  onSubmit: (value: number[]) => void;
  text: React.ReactNode;
  defaultLength?: number;
}

export interface IState {
  input: number[];
  error: string | null;
  isTyping: boolean;
}
