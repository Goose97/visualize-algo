export type ObjectType<T = any> = { [key: string]: T };

export interface StepInstruction {
  actions?: ObjectType<Action[]>;
  codeLine?: string;
  explanationStep?: number;
  duration?: number;
}

export interface Action<T = string> {
  name: T;
  params: Array<any>;
}

export interface ActionWithStep<T = string> extends Action<T> {
  step: number;
}

export interface PointCoordinate {
  x: number;
  y: number;
}

export type DataStructureMethod<T> = (model: T, params: any) => T;

export interface BaseMemoryBlockProps {
  visible?: boolean;
  focus?: boolean;
  value: string | number | null;
  label?: string[];
}

export interface HTMLRendererParams<T = {}> {
  model: T;
  wrapperElement: SVGGElement | null;
  coordinate: PointCoordinate;
  apiHandler?: (apiName: string, params?: ObjectType<any>) => void;
}
