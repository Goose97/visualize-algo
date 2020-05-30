import { BaseMemoryBlockProps } from 'types';

export interface IProps extends BaseMemoryBlockProps {
  x: number;
  y: number;
  aboutToDelete?: boolean;
  isNew?: boolean;
}
