import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query getEmergencyVehicleResolver(
    $variables: TypesGetVehiclesEmergencyTable!
  ) {
    getEmergencyVehicleResolver(variables: $variables) {
      data {
        _id
        key
        value
        plates
        serialNumber
      }
      total
    }
  }
`;
export const useQueryEmergencyActivationsClient = (variables: any) => {
  return useGraphQlQuery(
    'getEmergencyVehicleResolver',
    EDITACTIVATE,
    variables,
    'getEmergencyVehicleResolver',
  );
};
