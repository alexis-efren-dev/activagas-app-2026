import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query getInternalVinResolver($variables: TypesKeyFirstEmergency!) {
    getInternalVinResolver(variables: $variables)
  }
`;
export const useQueryGetInternalVin = (variables: any) => {
  return useGraphQlQuery(
    'getInternalVinResolver',
    EDITACTIVATE,
    variables,
    'getInternalVinResolver',
  );
};
