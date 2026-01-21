import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {graphqlRequestNestClient} from '../config/graphQlNestClient';
import type {DocumentNode} from 'graphql';

/**
 * Generic GraphQL Nest Query Hook
 * @template TData - The expected response data type
 * @template TVariables - The variables type (defaults to Record<string, any>)
 */
export const useGraphQlNestQuery = <
  TData = unknown,
  TVariables extends Record<string, any> = Record<string, any>,
>(
  key: string,
  query: DocumentNode | string,
  variables: TVariables,
  path: string,
  config: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'> = {},
) => {
  const request = graphqlRequestNestClient();
  request.setHeader('path', path);

  // Special case for auth queries
  if (key === 'auth' && 'token' in variables) {
    request.setHeader('authorizationToken', variables.token as string);
  }

  const fetchData = async (): Promise<TData> => {
    const response = await request.request<TData>(query, {variables});
    return response;
  };

  return useQuery<TData, Error>({
    queryKey: [key],
    queryFn: fetchData,
    ...config,
  });
};
