import { useCallback, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { accessTokenAtom, userInfoAtom, userAuthAtom } from "../store/atoms";

export const useAuthSetup = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const userInfo = useAtomValue(userInfoAtom);
  const initAuth = useSetAtom(userAuthAtom);

  const isLogged = !!accessToken && !!userInfo;

  const checkAuth = useCallback(async () => {
    if (!accessToken) {
      await initAuth();
    }
  }, [accessToken, initAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return isLogged;
};
