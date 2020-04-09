import { pick } from 'lodash';

export const classNameHelper = object => {
  let baseClassName = object.base || '';
  Object.entries(object).forEach(([key, value]) => {
    if (key === 'base') return;
    if (value) baseClassName += ` ${key}`;
  });

  return baseClassName;
};

export const produceFullState = (stepDescription, stateProperties) => {
  let result = [];
  for (let i = 0; i < stepDescription.length; i++) {
    let currentState = pick(stepDescription[i], stateProperties);
    if (i !== 0) currentState = Object.assign({}, result[i - 1], currentState);
    result.push(currentState);
  }

  return result;
};

export function promiseSetState(newState) {
  return new Promise(resolve => this.setState(newState, () => resolve()));
}
