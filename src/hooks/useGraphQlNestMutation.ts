import {useMutation, UseMutationOptions} from '@tanstack/react-query';
import {useDispatch} from 'react-redux';
import {customTypeError} from '../utils/customTypeError';
import {getAlertSuccess} from '../redux/states/alertsReducerState';
import {graphqlRequestNestClient} from '../config/graphQlNestClient';
import type {DocumentNode} from 'graphql';

/**
 * Generic GraphQL Nest Mutation Hook
 * @template TData - The expected response data type
 * @template TVariables - The variables type (defaults to Record<string, any>)
 */
export const useGraphQlNestMutation = <
  TData = unknown,
  TVariables = Record<string, any>,
>(
  mutation: DocumentNode | string,
  path: string,
  options?: Partial<UseMutationOptions<TData, Error, TVariables>>,
) => {
  const dispatch = useDispatch();

  const defaultOnError = (e: Error) => {
    dispatch(
      getAlertSuccess({
        message: '',
        show: false,
        messageError: customTypeError(e),
        showError: true,
      }),
    );
  };

  const defaultOnSuccess = (data: TData) => {
    const message: string = Object.values(data as object)[0] as string;
    dispatch(
      getAlertSuccess({
        message,
        show: true,
        messageError: '',
        showError: false,
      }),
    );
  };

  // Build custom options with defaults
  const customOptions: Partial<UseMutationOptions<TData, Error, TVariables>> = {
    ...options,
  };

  // Apply default handlers if not provided
  if (!options?.onError) {
    customOptions.onError = defaultOnError;
  }
  if (!options?.onSuccess) {
    customOptions.onSuccess = defaultOnSuccess;
  }

  const client = graphqlRequestNestClient();
  client.setHeader('path', path);

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await client.request<TData>(mutation, {variables});
      return response;
    },
    ...customOptions,
  });
};
