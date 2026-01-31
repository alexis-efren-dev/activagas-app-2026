/**
 * Factory functions for creating typed GraphQL service hooks
 *
 * Usage:
 * ```typescript
 * import { createQueryHook } from './createServiceHooks';
 * import { GetClientsResolverResponse } from '@/types/graphql';
 *
 * const QUERY = gql`...`;
 *
 * export const useQueryGetClients = createQueryHook<
 *   GetClientsResolverResponse,
 *   { idGas: string; page: number }
 * >('getClientsResolver', QUERY, 'getClientsResolver');
 * ```
 */
import {useGraphQlQuery} from '../hooks/useGraphQlQuery';
import {useGraphQlNestQuery} from '../hooks/useGraphQlNestQuery';
import {useGraphQlNestMutation} from '../hooks/useGraphQlNestMutation';
import type {DocumentNode} from 'graphql';
import type {UseQueryOptions, UseMutationOptions} from '@tanstack/react-query';

/**
 * Creates a typed query hook using the standard GraphQL client
 */
export const createQueryHook = <
  TData = unknown,
  TVariables = Record<string, any>,
>(
  key: string,
  query: DocumentNode,
  path: string,
  defaultConfig: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'> = {},
) => {
  return (
    variables: TVariables,
    config: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'> = {},
  ) => {
    return useGraphQlQuery<TData, TVariables>(key, query, variables, path, {
      ...defaultConfig,
      ...config,
    });
  };
};

/**
 * Creates a typed query hook using the Nest GraphQL client
 */
export const createNestQueryHook = <
  TData = unknown,
  TVariables extends Record<string, any> = Record<string, any>,
>(
  key: string,
  query: DocumentNode,
  path: string,
  defaultConfig: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'> = {},
) => {
  return (
    variables: TVariables,
    config: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'> = {},
  ) => {
    return useGraphQlNestQuery<TData, TVariables>(key, query, variables, path, {
      ...defaultConfig,
      ...config,
    });
  };
};

/**
 * Creates a typed mutation hook using the Nest GraphQL client
 */
export const createNestMutationHook = <
  TData = unknown,
  TVariables = Record<string, any>,
>(
  mutation: DocumentNode,
  path: string,
  defaultOptions: Partial<UseMutationOptions<TData, Error, TVariables>> = {},
) => {
  return (
    options: Partial<UseMutationOptions<TData, Error, TVariables>> = {},
  ) => {
    return useGraphQlNestMutation<TData, TVariables>(mutation, path, {
      ...defaultOptions,
      ...options,
    });
  };
};

/**
 * Type helper for extracting resolver data from a response
 * Usage: type ClientsData = ExtractResolverData<GetClientsResolverResponse, 'getClientsResolver'>
 */
export type ExtractResolverData<T, K extends keyof T> = T[K];
