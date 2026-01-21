import {useMutation} from '@tanstack/react-query';
import {useDispatch} from 'react-redux';
import {graphqlRequestClient} from '../config/graphQlClient';
import {customTypeError} from '../utils/customTypeError';
import {getAlertSuccess} from '../redux/states/alertsReducerState';
export const useGraphQlMutation = (
  mutation: any,
  path: string,
  options?: any,
) => {
  const dispatch = useDispatch();
  let customOptions;
  if (options.onSuccess || options.onError) {
    if (options.onSuccess && options.onError) {
      customOptions = {
        ...options,
      };
    } else if (options.onSuccess && !options.onError) {
      customOptions = {
        ...options,
        onError: (e: any) => {
          dispatch(
            getAlertSuccess({
              message: '',
              show: false,
              messageError: customTypeError(e),
              showError: true,
            }),
          );
        },
      };
    } else {
      customOptions = {
        ...options,
        onSuccess: (data: any) => {
          const message: any = Object.values(data)[0];
          dispatch(
            getAlertSuccess({
              message,
              show: true,
              messageError: '',
              showError: false,
            }),
          );
        },
      };
    }
  } else {
    customOptions = {
      ...options,
      onError: (e: any) => {
        dispatch(
          getAlertSuccess({
            message: '',
            show: false,
            messageError: customTypeError(e),
            showError: true,
          }),
        );
      },
      onSuccess: (data: any) => {
        const message: any = Object.values(data)[0];
        dispatch(
          getAlertSuccess({
            message,
            show: true,
            messageError: '',
            showError: false,
          }),
        );
      },
    };
  }

  const client = graphqlRequestClient();
  client.setHeader('path', path);
  return useMutation<any, Error, {}>({
    mutationFn: async variables => await client.request(mutation, {variables}),
    ...customOptions,
  });
};
