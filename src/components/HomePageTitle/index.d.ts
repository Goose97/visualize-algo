export interface IProps {}

export interface IState {
  translateY: number;
  currentWordIndex: number;
  wordList: Array<{ content: string; translateY: number }>;
}
