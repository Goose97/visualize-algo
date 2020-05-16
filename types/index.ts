export type ObjectType<T = any> = { [key: string]: T };

export interface StepInstruction {
  actions?: Action[];
  codeLine?: string;
  explanationStep?: number;
  duration?: number;
}

export interface Action {
  name: string;
  params: Array<any>;
}

export interface ActionWithStep extends Action {
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
  value: string | number;
}