import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const GETDATAGAS = gql`
  query ($variables: InputGeneralColors!) {
    getGeneralColorsResolver(variables: $variables) {
      colorText
      backgroundColor
    }
  }
`;
export const useQueryGetColors = (variables: any) => {
  return useGraphQlQuery(
    'getGeneralColorsResolver',
    GETDATAGAS,
    variables,
    'getGeneralColorsResolver',
  );
};
