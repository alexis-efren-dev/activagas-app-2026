import gql from "graphql-tag";
import { useGraphQlNestMutation } from "../../hooks/useGraphQlNestMutation";
import { useDispatch } from "react-redux";
import { getKey } from "../../redux/states/keySlice";

const TESTMUTATION = gql`
  mutation ($variables: CreateReleaseInput!) {
    createRelease(variables: $variables)
  }
`;
export const useMutationCreateRelease = () => {
    const dispatch = useDispatch()
  return useGraphQlNestMutation(TESTMUTATION, "createRelease", {
    onSuccess: (data: any) => {
          dispatch(getKey({key: data.createRelease}));
        },
  });
};
