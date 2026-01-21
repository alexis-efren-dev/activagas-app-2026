import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const GETDATAGAS = gql`
  query getReadTimeAppResolver($variables: TypesIdConfig!) {
    getReadTimeAppResolver(variables: $variables)
  }
`;
export const useQueryGetReadTime = (variables: any) => {
  return useGraphQlQuery(
    'getReadTimeAppResolver',
    GETDATAGAS,
    variables,
    'getReadTimeAppResolver',
  );
};
