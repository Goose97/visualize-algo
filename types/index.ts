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