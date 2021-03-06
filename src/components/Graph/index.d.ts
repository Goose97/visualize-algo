import {
  Action,
  DataStructureMethod,
  BaseMemoryBlockProps,
  BaseDSProps,
} from 'types';
import { Graph } from 'types/ds/Graph';

export interface IProps extends BaseDSProps {
  instructions?: Action<Graph.Method>[][];
  initialData?: Graph.Model;
  data?: Graph.Model;
}