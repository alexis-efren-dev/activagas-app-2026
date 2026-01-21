import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
const TESTMUTATION = gql`
mutation updateEnabledVehicleResolver($variables: TypesEnableDisable!){
    updateEnabledVehicleResolver(variables: $variables)
}
`;
export const useMutationUpdateEnabledVehicle = () => {
  return useGraphQlMutation(TESTMUTATION,'updateEnabledVehicleResolver',{
   });
};
