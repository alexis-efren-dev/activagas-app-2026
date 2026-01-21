import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';

const EDITACTIVATE = gql`
  query searchPlatesResolver($variables: TypeSearchPlates!) {
    searchPlatesResolver(variables: $variables) {
      serialNumber
      _id
      idGas
      plates
      model
    }
  }
`;
export const useQuerySearchPlates = (
  variables: any,
) => {
  return useGraphQlQuery(
    'searchPlatesResolver',
    EDITACTIVATE,
    variables,
    'searchPlatesResolver',
  );
};
