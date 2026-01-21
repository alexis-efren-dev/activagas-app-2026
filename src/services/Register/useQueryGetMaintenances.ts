import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';
const GETDATAGAS = gql`
query getMaintenancesAppResolver($variables: TypesGetServices!){
    getMaintenancesAppResolver(variables: $variables){
       data {
          _id
          frequency
          name
          typeService
       }
    }
   }
`;
export const useQueryGetMaintenances = (variables:any) => {
    return useGraphQlQuery('getMaintenancesAppResolver',GETDATAGAS,variables,'getMaintenancesAppResolver');
};
