import { PointCoordinate } from '../../types';
import { SVGAttributes } from 'react';

interface IProps extends SVGAttributes<SVGGElement> {
  following?: boolean;
  visited?: boolean;
  visible?: boolean;
  highlight?: boolean;
  arrowDirection?: 'left' | 'right' | 'up' | 'down'; // SHOULD REMOVE IN FUTURE
  isNew?: boolean;
  animationDuration?: string;
  onAnimationEnd?: (animationName: string) => void;
}

interface IState {
  transformList: string[];
  isDisappearing?: boolean;
}
