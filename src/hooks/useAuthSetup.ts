import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAuthAtom } from "../store/atoms";

export const useAuthSetup = () => {
  const [, authenticatedUser] = useAtom(userAuthAtom);

  useEffect(() => {
    authenticatedUser();
  }, [authenticatedUser]);
};
