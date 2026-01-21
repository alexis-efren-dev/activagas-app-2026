import gql from 'graphql-tag';
import { useGraphQlQuery } from '../../hooks/useGraphQlQuery';
const GETDATAGAS = gql`
query getEnabledVehicleResolver($variables: TypesEnableDisable!){
    getEnabledVehicleResolver(variables: $variables)
   }
`;
export const useQueryEnabledVehicle = (variables:any) => {
    return useGraphQlQuery('getEnabledVehicleResolver',GETDATAGAS,variables,'getEnabledVehicleResolver');
};
