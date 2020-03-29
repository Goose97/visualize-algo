export const classNameHelper = object => {
  let baseClassName = object.base || '';
  Object.entries(object).forEach(([key, value]) => {
    if (key === 'base') return;
    if (value) baseClassName += ` ${key}`;
  });

  return baseClassName;
};

export const produceFullState = (stepDescription, stateProperties) => {
  const produceFullStateForOneProperty = (fullStep, property) => {
    let result = [];
    for (let i = 0; i < fullStep.length; i++) {
      if (i === 0) {
        const initialState = fullStep[i][property];
        result.push(initialState);
      } else {
        const stateOfLastStep = result[result.length - 1];
        let stateOfThisStep = fullStep[i][property];
        stateOfThisStep =
          stateOfThisStep === undefined ? stateOfLastStep : stateOfThisStep;
        result.push(stateOfThisStep);
      }
    }

    return result;
  };

  return stateProperties.reduce(
    (result, property) => ({
      ...result,
      [property]: produceFullStateForOneProperty(stepDescription, property),
    }),
    {},
  );
};
