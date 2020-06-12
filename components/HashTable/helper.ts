export const caculateKeyHash = (key: string, universalKeySize: number) => {
  const sum = key
    .split('')
    .reduce((acc, letter) => acc + letter.charCodeAt(0), 0);
  return sum % universalKeySize;
};
