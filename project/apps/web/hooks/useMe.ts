import Router from "next/router";
import { useCallback } from "react";

import { useLoginState } from "@/contexts/LoginStateContext";

export const useMe = () => {
  const [me] = trpc.me.get.useSuspenseQuery();

  const { removeLoginStateFlag } = useLoginState();
  const logoutMutation = trpc.auth.logout.useMutation();

  const logout = useCallback(
    (redirectToSignIn = true) => {
      return logoutMutation.mutate(undefined, {
        onSuccess: async () => {
          removeLoginStateFlag();
          if (redirectToSignIn) {
            await Router.push("/sign-in");
          }
        },
      });
    },
    [logoutMutation, removeLoginStateFlag]
  );

  return { me, logout };
};
