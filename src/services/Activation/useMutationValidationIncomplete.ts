import gql from 'graphql-tag';
import {useDispatch} from 'react-redux';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
import { getKey } from '../../redux/states/keySlice';
const TESTMUTATION = gql`
  mutation getIncompleteKeyResolver($variables: TypesIncompleteKey!) {
    getIncompleteKeyResolver(variables: $variables)
  }
`;
export const useMutationValidationIncomplete = () => {
  const dispatch = useDispatch();
  return useGraphQlMutation(TESTMUTATION, 'getIncompleteKeyResolver', {
    onSuccess: (data: any) => {
      dispatch(getKey({key: data.getIncompleteKeyResolver}));
    },
  });
};
