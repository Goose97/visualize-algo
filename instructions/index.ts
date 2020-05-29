import { StepInstruction, Action } from 'types';

const DEFAULT_DURATION = 1500;

export class Instructions {
  private instructions: StepInstruction[];
  private duration: number;
  //@ts-ignore
  private buffer: Partial<StepInstruction>;
  constructor() {
    this.instructions = [];
    this.duration = DEFAULT_DURATION;
    this.initNewBuffer();
  }

  initNewBuffer() {
    // hold instruction which are not commited to instruction list
    this.buffer = { actions: {}, duration: this.duration };
  }

  pushActionsAndEndStep(assign: string, actions: Action[]) {
    this.pushAction(assign, actions);
    this.endStep();
  }

  pushAction(assign: string, actions: Action[]) {
    const oldActionOfThisAssignee = this.buffer.actions![assign];
    if (oldActionOfThisAssignee) {
      oldActionOfThisAssignee.push(...actions);
    } else {
      this.buffer.actions![assign] = [...actions];
    }
  }

  endStep() {
    this.instructions.push(this.buffer);
    this.initNewBuffer();
  }

  setCodeLine(codeLine?: string) {
    this.buffer.codeLine = codeLine;
  }

  get() {
    return this.instructions;
  }

  setDuration(duration: number) {
    this.duration = duration;
  }
}
