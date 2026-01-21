import gql from 'graphql-tag';
import {useGraphQlMutation} from '../../hooks/useGraphQlMutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';

import {customTypeError} from '../../utils/customTypeError';
import { getAlertSuccess } from '../../redux/states/alertsReducerState';
import { activeSessionAction } from '../../redux/states/activeSessionState';
import { useGraphQlNestMutation } from '../../hooks/useGraphQlNestMutation';

const TESTMUTATION = gql`
  mutation ($variables: RefreshTokenInput!) {
    refreshTokenResolver(variables: $variables) {
      refreshToken
      token
    }
  }
`;
export const useMutationRefreshTokenResolver = () => {
  const dispatch = useDispatch();
  const dispatchErrors = (message: string) => {
    dispatch(
      getAlertSuccess({
        message: '',
        show: false,
        messageError: message,
        showError: true,
      }),
    );
  };
  const deleteSession = async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
    dispatch(activeSessionAction({active: ''}));
  };
  return useGraphQlNestMutation(TESTMUTATION, 'refreshTokenResolver', {
    onSuccess: async (data: any) => {
      await AsyncStorage.clear();
      await AsyncStorage.setItem('authToken', data.refreshTokenResolver.token);
      await AsyncStorage.setItem(
        'refreshToken',
        data.refreshTokenResolver.refreshToken,
      );
    },
    onError: (e: any) => {
      dispatchErrors(
        customTypeError({
          response: {
            errors: [{message: 'Sesion expirada, vuelve a iniciar sesion'}],
          },
        }),
      );
      deleteSession();
    },
  });
};
