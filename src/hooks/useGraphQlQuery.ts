import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {graphqlRequestClient} from '../config/graphQlClient';
import type {DocumentNode} from 'graphql';

/**
 * Generic GraphQL Query Hook
 * @template TData - The expected response data type
 * @template TVariables - The variables type (defaults to Record<string, any>)
 */
export const useGraphQlQuery = <
  TData = unknown,
  TVariables = Record<string, any>,
>(
  key: string,
  query: DocumentNode | string,
  variables: TVariables,
  path: string,
  config: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'> = {},
) => {
  const request = graphqlRequestClient();
  request.setHeader('path', path);

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
