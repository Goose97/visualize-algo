export interface IProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPanning: (deltaX: number, deltaY: number) => void;
}
