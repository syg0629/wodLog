import { supabase } from "../api/supabase/supabaseClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import axios from "axios";
import { HoldWithUserInfo, Holiday } from "../types/type";

export const holdQueryKeys = createQueryKeys("hold", {
  // Hold/HoldList
  // Hold 목록
  list: (userInfo: { writerUuid?: string; auth?: string }) => ({
    queryKey: ["all", userInfo],
    queryFn: async (): Promise<HoldWithUserInfo[]> => {
      let query = supabase
        .from("hold")
        .select("*, userInfo(userName, remainingHoldDays)")
        .order("id", { ascending: false });

      if (userInfo.writerUuid && userInfo.auth !== "admin") {
        query = query.eq("writerUuid", userInfo.writerUuid);
      }

      const response = await query;
      const data = await handleSupabaseResponse(response);
      const holdWithUserInfo: HoldWithUserInfo[] = data.map((item) => {
        if (!item.userInfo) {
          throw new Error("ID가 존재하지 않습니다.");
        }
        return { ...item, userInfo: item.userInfo };
      });

      return holdWithUserInfo;
    },
  }),
  // Hold/EditHold
  // Hold 수정 시 기존 값 조회
  detail: (
    holdId: number,
    userInfo: { writerUuid?: string; auth?: string }
  ) => ({
    queryKey: [holdId, userInfo],
    queryFn: async (): Promise<HoldWithUserInfo> => {
      let query = supabase
        .from("hold")
        .select("*, userInfo(remainingHoldDays)")
        .eq("id", holdId);

      if (userInfo.writerUuid) {
        query = query.eq("writerUuid", userInfo.writerUuid);
      }

      const response = await query.single();
      const data = await handleSupabaseResponse(response);

      if (!data.userInfo) {
        throw new Error("ID가 존재하지 않습니다.");
      }
      return { ...data, userInfo: data.userInfo };
    },
  }),
  // Hold/WriteHold
  // Hold 등록 시 잔여 홀드일 조회
  new: (writerUuid: string) => ({
    queryKey: [writerUuid],
    queryFn: async () => {
      const data = await supabase
        .from("userInfo")
        .select("remainingHoldDays")
        .eq("id", writerUuid)
        .single();
      return await handleSupabaseResponse(data);
    },
  }),
  // Hold/WriteHold
  // Hold 등록, 수정 페이지 진입 시 공휴일 정보 조회
  holidays: (year: number) => ({
    queryKey: [year],
    queryFn: async (): Promise<Holiday[]> => {
      const bodyData = {
        url: `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?`,
        serviceKey: import.meta.env.VITE_APP_SERVICE_KEY,
        solYear: year,
      };
      try {
        const response = await axios.get(
          `${bodyData.url}serviceKey=${bodyData.serviceKey}&solYear=${bodyData.solYear}&numOfRows=30`
        );
        const holidays = response.data.response.body.items.item;
        return Array.isArray(holidays) ? holidays : [holidays];
      } catch (error) {
        console.error("공휴일 fetch 중 오류 >> ", error);
        return [];
      }
    },
  }),
});
