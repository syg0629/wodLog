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
export const userInfoAtom = atom<UserInfo>({
  userName: "",
  writerUuid: "",
  auth: "",
});

//로그인 상태 확인 및 로그아웃
export const loginLogoutAtom = atom(
  //로그인 상태 확인
  (get) => !!get(accessTokenAtom),
  //로그아웃
  async (_, set) => {
    try {
      await supabase.auth.signOut();
      set(accessTokenAtom, null);
      set(userInfoAtom, { userName: "", writerUuid: "", auth: "" });
    } catch (error) {
      console.error("로그아웃 중 에러 발생 >> ", error);
    }
  }
);
