import {useQuery} from '@tanstack/react-query';
import {graphqlRequestClient} from '../config/graphQlClient';
export const useGraphQlQuery = (
  key: string,
  query: any,
  variables: any,
  path: string,
  config: any = {},
) => {
  const request = graphqlRequestClient();
  request.setHeader('path', path);
  const fetchData = async () => await request.request(query, {variables});
  return useQuery({
    queryKey: [key],
    queryFn: fetchData,
    ...config,

  });
};
