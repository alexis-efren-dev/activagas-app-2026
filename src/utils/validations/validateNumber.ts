export const validateNumber = (numberValue: any) => {
  if (isNaN(Number(numberValue)) || String(numberValue).indexOf('.') > -1) {
    return false;
  }
  return true;
};
