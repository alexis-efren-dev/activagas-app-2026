import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query ($variables: TypesValidAplication!) {
    validAplicationResolver(variables: $variables)
  }
`;
export const useQueryGetValidDevice = (variables: any) => {
  return useGraphQlQuery(
    'validAplicationResolver',
    EDITACTIVATE,
    variables,
    'validAplicationResolver',
  );
};
