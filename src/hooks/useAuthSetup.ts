import { useEffect } from "react";
import { useAtom } from "jotai";
import { accessTokenAtom, userInfoAtom } from "../store/atoms";
import { supabase } from "../api/supabase/supabaseClient";

export const useAuthSetup = () => {
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [, setUserInfo] = useAtom(userInfoAtom);

  useEffect(() => {
    const userAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session?.access_token) {
          setAccessToken(data.session.access_token);

          const { data: userInfoData, error: userInfoError } = await supabase
            .from("userInfo")
            .select("userName, auth")
            .eq("id", data.session?.user.id)
            .single();

          if (userInfoError) throw userInfoError;

          setUserInfo({
            userName: userInfoData.userName,
            writerUuid: data.session.user.id,
            auth: userInfoData.auth,
          });
        }
      } catch (error) {
        console.error("로그인 세션 에러 >> ", error);
      }
    };
    userAuth();
  }, [setAccessToken, setUserInfo]);
};
