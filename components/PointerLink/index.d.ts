import { PointCoordinate } from '../../types';

interface IProps {
  path: string;
  following?: boolean;
  visited?: boolean;
  visible?: boolean;
  arrowDirection?: 'left' | 'right' | 'up' | 'down'; // SHOULD REMOVE IN FUTURE
}

interface IState {
  offsetFromFinish: number;
  offsetOfFollowAnimation?: number;
  transformList: string[];
  isFollowing?: boolean;
  isDisappearing?: boolean;
  isDoneFollowing?: boolean;
}
