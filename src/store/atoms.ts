import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { supabase } from "../config/supabaseClient";
import { UserInfo } from "../types/type";

// accessToken 저장 atom
export const accessTokenAtom = atomWithStorage<string | null>(
  "accessToken",
  null
);

// 사용자 정보 저장 atom
export const userInfoAtom = atomWithStorage<UserInfo | null>("userInfo", null);

// 로그인 상태 확인 atom
export const isAuthenticatedAtom = atom((get) => {
  const accessToken = get(accessTokenAtom);
  const userInfo = get(userInfoAtom);
  return !!accessToken && !!userInfo;
});

// 사용자 인증 세션 확인 및 사용자 정보 초기화 atom
export const userAuthAtom = atom(null, async (get, set) => {
  // 이미 인증된 상태
  if (get(isAuthenticatedAtom)) return;

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
    } else {
      set(accessTokenAtom, null);
      set(userInfoAtom, null);
    }
  } catch (error) {
    console.error("로그인 세션 에러 >> ", error);
    set(accessTokenAtom, null);
    set(userInfoAtom, null);
  }
});

// 로그아웃
export const logoutAtom = atom(null, async (_, set) => {
  try {
    await supabase.auth.signOut();
    set(accessTokenAtom, null);
    set(userInfoAtom, null);
  } catch (error) {
    console.error("로그아웃 중 에러 발생 >> ", error);
  }
});
