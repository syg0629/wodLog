import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { accessTokenAtom, userInfoAtom } from "../../store/atoms";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { getGoogleUserInfo, getGoogleToken } from "../../api/auth/googleAuth";
import { getKakaoUserInfo, getKakaoToken } from "../../api/auth/kakaoAuth";

export const AuthHandler = () => {
  const navigate = useNavigate();
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setUserInfo = useSetAtom(userInfoAtom);
  const tokenSetRef = useRef(false);
  const [searchParams] = useSearchParams();
  const state = searchParams.get("state");
  const code = searchParams.get("code");

  useEffect(() => {
    const handleCallback = async () => {
      if (tokenSetRef.current) return;

      if (code && state) {
        try {
          const tokenData = await (state === "kakao"
            ? getKakaoToken(code)
            : getGoogleToken(code));
          const userInfoData = await (state === "kakao"
            ? getKakaoUserInfo(tokenData.access_token)
            : getGoogleUserInfo(tokenData.access_token));

          setAccessToken(tokenData.access_token);
          tokenSetRef.current = true;

          const { data: userInfo, error: userInfoError } = await supabase
            .from("userInfo")
            .select("userName, auth, id")
            .eq(
              "email",
              state === "kakao"
                ? userInfoData.kakao_account.email
                : userInfoData.email
            )
            .single();

          if (userInfoError) throw userInfoError;

          const userName = userInfo.userName;

          setUserInfo({
            userName,
            writerUuid: userInfo.id,
            auth: userInfo.auth,
          });
          alert(`${userName}님 안녕하세요~🏋🏻`);
          navigate("/");
        } catch (error) {
          console.error(`${state} 로그인 처리 중 오류 발생 >> `, error);
          alert(
            `${state} 로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.`
          );
          navigate("/login");
        }
      } else {
        console.error("URL에서 인증 코드를 찾을 수 없음");
        navigate("/login");
      }
    };
    handleCallback();
  }, [code, navigate, searchParams, setAccessToken, setUserInfo, state]);

  return null;
};
