export const classNameHelper = object => {
  let baseClassName = object.base || '';
  Object.entries(object).forEach(([key, value]) => {
    if (key === 'base') return;
    if (value) baseClassName += ` ${key}`;
  });

  return baseClassName;
};
