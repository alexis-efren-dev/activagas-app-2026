import gql from 'graphql-tag';
import {useDispatch} from 'react-redux';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
import { handlerNfcMaintenanceAction } from '../../redux/states/handlerNfcMaintenanceSlice';
const TESTMUTATION = gql`
  mutation searchBySerialIdResolver($variables: TypeSearchPlates!) {
    searchBySerialIdResolver(variables: $variables)
  }
`;
export const useQuerySearchBySerialId = () => {
  const dispatch = useDispatch();
  return useGraphQlMutation(TESTMUTATION, 'searchBySerialIdResolver', {
    onSuccess: () => {
      dispatch(handlerNfcMaintenanceAction(''));
    },
  });
};
