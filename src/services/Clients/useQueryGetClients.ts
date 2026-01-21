import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query getClientsResolver($variables: TypesFiltersEditActivatorsResolver!) {
    getClientsResolver(variables: $variables) {
      data {
        firstName
        _id
        cellPhone
        idClientSigned
      }
      total
    }
  }
`;
export const useQueryGetClients = (variables: any) => {
  return useGraphQlQuery(
    'getClientsResolver',
    EDITACTIVATE,
    variables,
    'getClientsResolver',
  );
};
