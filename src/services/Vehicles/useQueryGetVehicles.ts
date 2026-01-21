import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query getVehiclesResolver($variables: TypesGetVehicles!) {
    getVehiclesResolver(variables: $variables) {
      data {
        idGas
        _id
        plates
        model
        serialNumber
        whatsappSupport
        serialPlates
      }
      total
    }
  }
`;
export const useQueryGetVehicles = (variables: any) => {
  return useGraphQlQuery(
    'getVehiclesResolver',
    EDITACTIVATE,
    variables,
    'getVehiclesResolver',
  );
};
