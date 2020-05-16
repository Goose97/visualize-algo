import { StepInstruction } from 'types';

const DEFAULT_DURATION = 1500;

export class Instructions {
  private instructions: StepInstruction[];
  constructor() {
    this.instructions = [];
  }

  push(instruction: StepInstruction) {
    const newInstruction: StepInstruction = Object.assign(
      { duration: DEFAULT_DURATION },
      instruction,
    );
    this.instructions.push(newInstruction);
  }

  get() {
    return this.instructions;
  }
}

export class StackItem {
  val: number;
  key: number;
  constructor(val: number, key: number) {
    this.val = val;
    this.key = key;
  }
}

export const initStack = (array: number[]): StackItem[] => {
  return array.map((value, index) => ({
    val: value,
    key: array.length - 1 - index,
  }));
};
