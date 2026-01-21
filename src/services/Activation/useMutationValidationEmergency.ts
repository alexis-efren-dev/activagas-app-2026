import gql from 'graphql-tag';
import {useDispatch} from 'react-redux';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
import {getKey} from '../../redux/states/keySlice';
const TESTMUTATION = gql`
  mutation getEmergencyKeyResolver($variables: TypesEmergencyKey!) {
    getEmergencyKeyResolver(variables: $variables)
  }
`;
export const useMutationValidationEmergency = () => {
  const dispatch = useDispatch();
  return useGraphQlMutation(TESTMUTATION, 'getEmergencyKeyResolver', {
    onSuccess: (data: any) => {
      dispatch(getKey({key: data.getEmergencyKeyResolver}));
    },
  });
};
