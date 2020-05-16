import { PointCoordinate } from '../../types';

interface IProps {
  path: string;
  following?: boolean;
  visited?: boolean;
  visible?: boolean;
  arrowDirection?: 'left' | 'right' | 'up' | 'down'; // SHOULD REMOVE IN FUTURE
}

interface IState {
  transformList: string[];
  isFollowing?: boolean;
  isDisappearing?: boolean;
}
