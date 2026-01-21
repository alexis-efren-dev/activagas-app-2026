import gql from 'graphql-tag';
import { useDispatch } from 'react-redux';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
import { getKey } from '../../redux/states/keySlice';

const TESTMUTATION = gql`
mutation emergencyActivationMaintenanceResolver($variables: TypesEmergencyActivationMaintenance!){
    emergencyActivationMaintenanceResolver(variables: $variables)
}
`;
export const useMutationEmergencyMaintenance = () => {
    const dispatch = useDispatch();
  return useGraphQlMutation(TESTMUTATION,'emergencyActivationMaintenanceResolver',{
      onSuccess:(data:any)=>{
        dispatch(getKey({key:data.emergencyActivationMaintenanceResolver}));
      },
   });
};
