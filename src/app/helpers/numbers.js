export const getPercentageValue = (current, min, max) => {
  const result = ((current - min) / (max - min)) * 100;
  if (result % 1 !== 0) {
    return result.toFixed(0);
  }

  return result;
};
