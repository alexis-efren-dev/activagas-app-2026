import gql from "graphql-tag";
import { useGraphQlNestQuery } from "../../hooks/useGraphQlNestQuery";
const EDITACTIVATE = gql`
  {
    versionResolver
  }
`;
export const useQueryGetVersionApp = (variables: any) => {
  return useGraphQlNestQuery(
    "versionResolver",
    EDITACTIVATE,
    variables,
    "versionResolver"
  );
};
