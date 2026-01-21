import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';
const GETDATAGAS = gql`
query getServicesAppResolver($variables: TypesGetServices!){
    getServicesAppResolver(variables: $variables){
       data {
          _id
          frequency
          name
          typeService
       }
    }
   }
`;
export const useQueryGetServices = (variables:any) => {
    return useGraphQlQuery('getServicesAppResolver',GETDATAGAS,variables,'getServicesAppResolver');
};
