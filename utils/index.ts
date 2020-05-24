import { pick } from 'lodash';

import { ObjectType } from 'types';

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
