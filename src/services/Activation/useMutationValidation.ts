import gql from 'graphql-tag';
import {useDispatch} from 'react-redux';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
import { getKey } from '../../redux/states/keySlice';
const TESTMUTATION = gql`
  mutation getKeyResolver($variables: TypesKey!) {
    getKeyResolver(variables: $variables)
  }
`;
export const useMutationValidation = () => {
  const dispatch = useDispatch();
  return useGraphQlMutation(TESTMUTATION, 'getKeyResolver', {
    onSuccess: (data: any) => {
      dispatch(getKey({key: data.getKeyResolver}));
    },
  });
};
