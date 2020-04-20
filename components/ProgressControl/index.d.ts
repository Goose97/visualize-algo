export interface IProps {
  className?: string;
  autoPlay: boolean;
  onFastBackward: () => void;
  onBackward: () => void;
  onPlay: () => void;
  onStop: () => void;
  onForward: () => void;
  onFastForward: () => void;
  progress: number;
}
