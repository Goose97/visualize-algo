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
  highlight?: boolean;
  blur?: boolean;
  labelDirection?: 'top' | 'left' | 'right' | 'bottom';
}

export interface HTMLRendererParams<T = {}> {
  model: T;
  wrapperElement: SVGGElement | null;
  coordinate: PointCoordinate;
  apiHandler?: (apiName: string, params?: ObjectType<any>) => void;
}

export interface BaseDSProps {
  x: number;
  y: number;
  currentStep?: number;
  totalStep?: number;
  interactive?: boolean;
  controlled?: boolean;
  handleExecuteApi?: (apiName: string, params?: ObjectType<any>) => void;
}

export interface BaseDSPageState {
  currentStep?: number;
  stepDescription: StepInstruction[];
  autoPlay: boolean;
}
