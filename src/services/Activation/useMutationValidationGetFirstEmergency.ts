import gql from 'graphql-tag';
import {useDispatch} from 'react-redux';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
import { getKey } from '../../redux/states/keySlice';

const TESTMUTATION = gql`
  mutation getFirstEmergencyKeyResolver($variables: TypesKeyFirstEmergency!) {
    getFirstEmergencyKeyResolver(variables: $variables)
  }
`;
export const useMutationValidationGetFirstEmergency = () => {
  const dispatch = useDispatch();
  return useGraphQlMutation(TESTMUTATION, 'getFirstEmergencyKeyResolver', {
    onSuccess: (data: any) => {
      dispatch(getKey({key: data.getFirstEmergencyKeyResolver}));
    },
    onError: () => {},
  });
};
