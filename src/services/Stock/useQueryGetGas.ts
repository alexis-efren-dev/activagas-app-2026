import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`

query gaserasTableResolver($variables: TypesFiltersEditActivatorsResolverGas!){
    gaserasTableResolver(variables: $variables){
      total,
      data {
        cellPhone,
        _id,
        name,
        municipality,
        key,
      }
    }
  }
`;
export const useQueryGetGas = (variables:any) => {
    return useGraphQlQuery('gaserasTableResolver',EDITACTIVATE,variables,'gaserasTableResolver');
};
