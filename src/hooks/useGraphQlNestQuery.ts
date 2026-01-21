import { useQuery } from "@tanstack/react-query";
import { graphqlRequestNestClient } from "../config/graphQlNestClient";
export const useGraphQlNestQuery = (
  key: string,
  query: any,
  variables: any,
  path: string,
  config: any = {}
) => {
  const request = graphqlRequestNestClient();
  request.setHeader("path", path);
  if(key === "auth") request.setHeader("authorizationToken",variables.token)
  const fetchData = async () => await request.request(query, { variables });
  return useQuery({
    queryKey: [key],
    queryFn: fetchData,
    ...config,
  });
};
