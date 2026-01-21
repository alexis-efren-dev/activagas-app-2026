import AsyncStorage from '@react-native-async-storage/async-storage';
import gql from 'graphql-tag';
import {useDispatch} from 'react-redux';
import {customTypeError} from '../../utils/customTypeError';
import { getAlertSuccess } from '../../redux/states/alertsReducerState';
import { activeSessionAction } from '../../redux/states/activeSessionState';
import { useGraphQlNestQuery } from '../../hooks/useGraphQlNestQuery';
//esto se pondra en el endpoint del refresh token, no aqui
const AUTH = gql`
  query verifyAuthResolver($variables: TypesVerifyAuth!) {
    verifyAuthResolver(variables: $variables) {
      _id
      idRol
      cellPhone
      idGas
      leavingWorkTime
    }
  }
`;
export const useQueryAuth = (token: string) => {
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
    dispatch(activeSessionAction({active: ''})); //buscar donde esta matando esto
  };
  return useGraphQlNestQuery('auth', AUTH, {token}, '', {
    onError: (e: any) => {
      if (e.message.indexOf('Token') > -1) {
        dispatchErrors(customTypeError(e));
        deleteSession();
      }
      if (e.message.indexOf('Tus permisos') > -1) {
        dispatchErrors(customTypeError(e));
        deleteSession();
      }
    },
  });
};
