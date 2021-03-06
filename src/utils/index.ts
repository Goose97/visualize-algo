import { pick } from 'lodash';
import BezierEasing from 'bezier-easing';

import { GRAPH_NODE_RADIUS } from '../constants';
import { ObjectType, Action, StepInstruction, PointCoordinate } from 'types';

export const classNameHelper = (object: ObjectType<string | boolean>) => {
  let baseClassName = (object.base as string) || '';
  Object.entries(object).forEach(([key, value]) => {
    if (key === 'base') return;
    if (!!value) baseClassName += ` ${key}`;
  });

  return baseClassName;
};

export const produceFullState = (
  stepDescription: Object[],
  stateProperties: string[],
) => {
  let result = [];
  for (let i = 0; i < stepDescription.length; i++) {
    let currentState = pick(stepDescription[i], stateProperties);
    if (i !== 0) currentState = Object.assign({}, result[i - 1], currentState);
    result.push(currentState);
  }

  return result;
};

export function promiseSetState(
  newState: Record<string, any>,
): Promise<undefined> {
  //@ts-ignore
  return new Promise(resolve => this.setState(newState, () => resolve()));
}

export const compactObject = (object: ObjectType) => {
  for (let property in object) {
    if (object.hasOwnProperty(property)) {
      if (object[property] === undefined || object[property] === null)
        delete object[property];
    }
  }

  return object;
};

export const getProgressDirection = (
  currentStep: number,
  previousStep: number,
  totalStep: number,
  switchingApi?: boolean,
) => {
  if (switchingApi) return 'switch';
  if (previousStep === undefined) return 'forward';
  if (currentStep === previousStep) return 'stay';
  if (currentStep > previousStep) {
    if (currentStep - previousStep === 1) return 'forward';
    else if (currentStep === totalStep) return 'fastForward';
  } else {
    if (previousStep - currentStep === 1) return 'backward';
    else if (currentStep === 0) return 'fastBackward';
  }
};

export const upcaseFirstLetterAndSplit = (string: string) => {
  const regex = /[A-Z]/g;
  let result = string.replace(regex, value => ` ${value}`);
  return result[0].toUpperCase() + result.slice(1);
};

export const keyExist = (object: Object, keys: string[]) => {
  return keys.every(key => key in object);
};

export const extractInstructionFromDescription = (
  description: StepInstruction[],
  dsName: string,
): Action[][] => {
  return description.map(({ actions }) => {
    if (!actions) return [];
    if (!actions[dsName]) return [];
    return actions[dsName];
  });
};

export const caculatePointerPathFromTwoNodeCenter = (
  nodeACenter: PointCoordinate,
  nodeBCenter: PointCoordinate,
  radius: number,
  noArrow?: boolean,
) => {
  const angle = caculateAngleOfLine(nodeACenter, nodeBCenter);
  const contactPointWithA = {
    x: nodeACenter.x + Math.cos(angle) * radius,
    y: nodeACenter.y + Math.sin(angle) * radius,
  };

  const length =
    caculateLength(nodeACenter, nodeBCenter) - 2 * GRAPH_NODE_RADIUS;
  const offsetForArrow = noArrow ? 0 : 6;
  const path = `M ${contactPointWithA.x} ${contactPointWithA.y} h ${
    length - offsetForArrow
  }`;
  const transform = `rotate(${(angle / Math.PI) * 180} ${contactPointWithA.x} ${
    contactPointWithA.y
  })`;
  return { path, transform };
};

const caculateLength = (pointA: PointCoordinate, pointB: PointCoordinate) => {
  return Math.sqrt((pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2);
};

const caculateAngleOfLine = (
  start: PointCoordinate,
  finish: PointCoordinate,
) => {
  const deltaX = finish.x - start.x;
  const deltaY = finish.y - start.y;
  let tan = deltaY / deltaX;
  if (finish.x >= start.x) {
    return Math.atan(tan);
  } else {
    return Math.atan(tan) > 0
      ? Math.atan(tan) - Math.PI
      : Math.atan(tan) + Math.PI;
  }
};

export const caculateDistanceToALine = (
  pointA: PointCoordinate,
  pointB: PointCoordinate,
  pointC: PointCoordinate,
) => {
  // Distance from A to BC
  const ab = caculateLength(pointA, pointB);
  const bc = caculateLength(pointB, pointC);
  const ca = caculateLength(pointC, pointA);

  // Caculate triangle area use Heron's formula
  const s = (ab + bc + ca) / 2;
  const area = Math.sqrt(s * (s - ab) * (s - bc) * (s - ca));
  return (area * 2) / bc;
};

interface PerformAnimationParams {
  startValue: number;
  endValue: number;
  duration: number;
  callback: (newValue: number) => void;
  cubicBezierFunction?: (progress: number) => number;
}
export const performAnimation = (params: PerformAnimationParams) => {
  const { duration, callback, endValue, startValue } = params;
  const cubicBezierFunction =
    params.cubicBezierFunction || BezierEasing(0.25, 0.1, 0.25, 1);
  const originTime = performance.now();
  const updateValueThroughFrame = () => {
    window.requestAnimationFrame((currentTime: number) => {
      const timeProgress = (currentTime - originTime) / duration;
      const animationProgess =
        timeProgress > 1 ? 1 : cubicBezierFunction(timeProgress);
      if (animationProgess >= 1) callback(endValue);
      else {
        const currentValue =
          animationProgess * (endValue - startValue) + startValue;
        callback(currentValue);
        updateValueThroughFrame();
      }
    });
  };

  updateValueThroughFrame();
};

export const getCanvasScaleFactor = () => {
  try {
    const canvasContainer = document.querySelector('.canvas-container');
    //@ts-ignore
    return parseFloat(canvasContainer?.getAttribute('scale-factor') || 1);
  } catch (e) {
    console.log(e);
    return 1;
  }
};

interface AnimationTaskQueueConstructor<T> {
  callback: (task: T) => void;
  isAdditiveTask?: boolean;
  combineTaskCallback?: (tasks: T[]) => T;
  taskQueueMax?: number; // if task queue reach this number of tasks, we start discarding tasks
}
export class AnimationTaskQueue<T> {
  private taskQueue: any[];
  private isRunning: boolean;
  private callback: AnimationTaskQueueConstructor<T>['callback'];
  private isAdditive?: boolean;
  private taskQueueMax: number;
  private combineTaskCallback: AnimationTaskQueueConstructor<
    T
  >['combineTaskCallback'];

  constructor(initObject: AnimationTaskQueueConstructor<T>) {
    const {
      callback,
      isAdditiveTask,
      combineTaskCallback,
      taskQueueMax,
    } = initObject;
    this.taskQueue = [];
    this.isRunning = false;
    this.callback = callback;
    this.isAdditive = isAdditiveTask;
    this.combineTaskCallback = combineTaskCallback;
    this.taskQueueMax = taskQueueMax || 2;
  }

  enqueue(task: any) {
    this.taskQueue.push(task);
    if (!this.isRunning) {
      this.isRunning = true;
      this.dequeue();
    }
  }

  // Drop some tasks if tasks fill up too fast
  // If task is additive (meaning drop task will alter result), we must combine many task into one
  dequeue() {
    if (this.taskQueue.length > this.taskQueueMax) this.discardTasks();

    const nextTask = this.taskQueue.shift();
    if (!nextTask) {
      this.isRunning = false;
      return;
    }

    window.requestAnimationFrame(() => {
      this.callback(nextTask);
      this.dequeue();
    });
  }

  discardTasks() {
    // if task is additive, must combine them
    // otherwise just drop them
    if (this.isAdditive) {
      const discardTasks = this.taskQueue.splice(0, this.taskQueueMax);
      const combinedTask = this.combineTaskCallback!(discardTasks);
      this.taskQueue.unshift(combinedTask);
    } else {
      this.taskQueue.splice(0, this.taskQueueMax);
    }
  }
}
