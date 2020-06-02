import { pick } from 'lodash';
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
) => {
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

export const upcaseFirstLetter = (string: string) => {
  if (string.length === 0) return string;
  return string[0].toUpperCase() + string.slice(1);
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
) => {
  const angle = caculateAngleOfLine(nodeACenter, nodeBCenter);
  const contactPointWithA = {
    x: nodeACenter.x + Math.cos(angle) * radius,
    y: nodeACenter.y + Math.sin(angle) * radius,
  };

  const length =
    caculateLength(nodeACenter, nodeBCenter) - 2 * GRAPH_NODE_RADIUS;
  const offsetForArrow = 6;
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
