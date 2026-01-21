export const customTypeError: Function = (error: any): string => {
  if (!(error instanceof TypeError)) {
    const customError: any = error;
    if (String(customError.response.errors[0].message).indexOf('Mongo') > -1) {
      return 'Revisa tu conexion a internet, si el problema persiste, probablemente sea un error de servidor que ya fue reportado';
    }
    return customError.response.errors[0].message || 'Error de servidor';
  } else {
    return 'Revisa tu conexion a internet, si el problema persiste, probablemente sea un error de servidor que ya fue reportado';
  }
};
