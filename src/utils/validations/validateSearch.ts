export const validateSearch = (textToSearch: string): boolean => {
  const validSearch = /^[A-Za-z0-9]*$/;
  return validSearch.test(textToSearch);
};
