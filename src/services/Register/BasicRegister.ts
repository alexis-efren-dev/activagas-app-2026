import gql from 'graphql-tag';
import {useDispatch} from 'react-redux';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
import { handlerFormRegisterAction } from '../../redux/states/handlerFormRegisterSlice';
const TESTMUTATION = gql`
  mutation registerResolver($variables: TypeRegister!) {
    registerResolver(variables: $variables)
  }
`;
export const useMutationRegister = () => {
  const dispatch = useDispatch();
  return useGraphQlMutation(TESTMUTATION, 'registerResolver', {
    onSuccess: async (data: any, _variables: any, _context: unknown) => {
      dispatch(handlerFormRegisterAction(data.registerResolver));
    },
  });
};
