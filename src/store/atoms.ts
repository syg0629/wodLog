import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { supabase } from "../api/supabase/supabaseClient";
import { UserInfo } from "../types/type";

//로그인 시 받아오는 토큰
export const accessTokenAtom = atomWithStorage<string | null>(
  "accessToken",
  null
);

//로그인 시 받아오는 유저 정보
export const userInfoAtom = atom<UserInfo | null>(null);

//세션 확인 및 유저 정보 설정
export const baseUserAuthAtom = atom(null, async (_, set) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (data.session?.access_token) {
      set(accessTokenAtom, data.session.access_token);

      const { data: userInfoData, error: userInfoError } = await supabase
        .from("userInfo")
        .select("userName, auth")
        .eq("id", data.session?.user.id)
        .single();

      if (userInfoError) throw userInfoError;

      set(userInfoAtom, {
        userName: userInfoData.userName,
        writerUuid: data.session.user.id,
        auth: userInfoData.auth,
      });
    }
  } catch (error) {
    console.error("로그인 세션 에러 >> ", error);
    set(accessTokenAtom, null);
    set(userInfoAtom, null);
  }
});

//로그인 상태 확인 및 로그아웃
export const userAuthAtom = atom(
  //로그인 상태 확인(accessToken 반환)
  (get) => get(accessTokenAtom),
  //로그아웃
  async (_, set) => {
    try {
      await supabase.auth.signOut();
      set(accessTokenAtom, null);
      set(userInfoAtom, null);
    } catch (error) {
      console.error("로그아웃 중 에러 발생 >> ", error);
    }
  }
);
