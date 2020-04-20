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

export function promiseSetState(newState: Record<string, any>) {
  //@ts-ignore
  return new Promise(resolve => this.setState(newState, () => resolve()));
}
