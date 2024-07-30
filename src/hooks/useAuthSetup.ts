import { useCallback, useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { accessTokenAtom, userInfoAtom, userAuthAtom } from "../store/atoms";
import { useState } from "react";

// 사용자 정보를 확인하고 로그인 상태를 설정하는 커스텀 훅
export const useAuthSetup = () => {
  const accessToken = useAtomValue(accessTokenAtom);
  const userInfo = useAtomValue(userInfoAtom);
  const initAuth = useSetAtom(userAuthAtom);

  // 인증 확인이 완료되기 전에 로그인 페이지로 라우팅되는 것 방지
  const [isChecking, setIsChecking] = useState(true);

  const checkAuth = useCallback(async () => {
    setIsChecking(true);
    try {
      await initAuth();
    } catch (error) {
      console.error("사용자 정보 확인 실패:", error);
    } finally {
      setIsChecking(false);
    }
  }, [initAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isLogged = !!accessToken && !!userInfo;

  return { isLogged, isChecking };
};
