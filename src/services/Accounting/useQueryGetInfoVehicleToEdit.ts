import gql from 'graphql-tag';
import {useGraphQlQuery} from '../../hooks/useGraphQlQuery';
const EDITACTIVATE = gql`
  query getInfoVehicleToEditResolver($variables: TypesGetINfoVehicleToEdit!) {
    getInfoVehicleToEditResolver(variables: $variables) {
      idClient
      serialNumber
      _id
      brand
      idPayment
      allGas
      plates
      model
      circulationSerial
      tankSerial
      inactivityDays
      numberOfMonthsContract
      cylinders
      others
      totalPrice
      isPriceEditable
      service
      calendar
      frequencySelected
      limitPay
      maintenance
      frequencySelectMaintenance
      initialLiterPolicy
      initialActivationPolicy
      parsedPolicies
      isNaturalGas
      finalDateToPay
      withMileage
      timeOff
      vehicleEmergencyActivations {
        key
        value
      }
    }
  }
`;
export const useQueryGetInfoVehicleToEdit = (variables: any) => {
  return useGraphQlQuery(
    'getInfoVehicleToEditResolver',
    EDITACTIVATE,
    variables,
    'getInfoVehicleToEditResolver',
  );
};
