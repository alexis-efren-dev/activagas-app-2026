import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
mutation registerAditionalVehicleResolver($variables: TypesRegisterAditionalVehicle!){
    registerAditionalVehicleResolver(variables: $variables)
}
`;
export const useMutationAditionalVehicle = () => {
  return useGraphQlMutation(TESTMUTATION,'registerAditionalVehicleResolver',{
   });
};
