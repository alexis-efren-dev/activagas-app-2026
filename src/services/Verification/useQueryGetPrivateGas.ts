import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query gaserasPrivateResolver($variables: TypesPrivateGas!) {
    gaserasPrivateResolver(variables: $variables) {
      total
      data {
        cellPhone
        _id
        name
        municipality
        key
      }
    }
  }
`;
export const useQueryGetPrivateGas = (variables: any) => {
  return useGraphQlQuery(
    'gaserasPrivateResolver',
    EDITACTIVATE,
    variables,
    'gaserasPrivateResolver',
  );
};
