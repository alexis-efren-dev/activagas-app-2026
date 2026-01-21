import AsyncStorage from "@react-native-async-storage/async-storage";
import gql from "graphql-tag";
import { useGraphQlNestMutation } from "../../hooks/useGraphQlNestMutation";

const TESTMUTATION = gql`
  mutation ($variables: TypesLogin!) {
    loginV2Resolver(variables: $variables) {
      token
      refreshToken
    }
  }
`;
export const useMutationLogin = () => {
  return useGraphQlNestMutation(TESTMUTATION, "", {
    onSuccess: async (data: any) => {
      await AsyncStorage.setItem("authToken", data.loginV2Resolver.token);
      await AsyncStorage.setItem(
        "refreshToken",
        data.loginV2Resolver.refreshToken
      );
    },
  });
};
