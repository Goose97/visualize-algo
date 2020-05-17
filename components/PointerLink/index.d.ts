import { PointCoordinate } from '../../types';
import { SVGAttributes } from 'react';

interface IProps extends SVGAttributes<SVGGElement> {
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
