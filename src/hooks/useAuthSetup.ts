import { useEffect } from "react";
import { useAtom } from "jotai";
import { baseUserAuthAtom } from "../store/atoms";

export const useAuthSetup = () => {
  const [, authenticatedUser] = useAtom(baseUserAuthAtom);

  useEffect(() => {
    authenticatedUser();
  }, []);
};
