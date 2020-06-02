import { IProps as PointerLinkProps } from '../PointerLink/index.d';
import { PointCoordination } from 'types';

export interface IProps extends PointerLinkProps {
  from: PointCoordination;
  to: PointCoordination;
}
