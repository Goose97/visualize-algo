import { PointCoordinate } from '../../types';

interface IProps {
  start: PointCoordinate;
  finish: PointCoordinate;
  following?: boolean;
  visited?: boolean;
  visible?: boolean;
  name?: number;
  onFinishFollow?: () => void;
}

interface IState {
  offsetFromFinish: number;
  offsetOfFollowAnimation?: number;
  transformList: string[];
  isFollowing?: boolean;
  isDisappearing?: boolean;
  isDoneFollowing?: boolean;
}
