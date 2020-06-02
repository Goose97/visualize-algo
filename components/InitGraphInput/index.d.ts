import { PointCoordinate } from 'types/';
import { Graph } from 'types/ds/Graph';

export interface IProps {
  onChange?: (value: number[]) => void;
  onSubmit: (value: Array<number | null>) => void;
}

export interface IState {
  textInput?: string;
  input: Array<number | null>;
  error: string | null;
  isModalVisible: boolean;
  graphData: Graph.Model;
}
