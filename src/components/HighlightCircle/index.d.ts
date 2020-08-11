export interface IProps {
  x: number;
  y: number;
  radius: number;
  animationDuration?: number;
}

export interface IState {
  completePercent: number;
  isAnimating: boolean;
}