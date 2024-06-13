import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../api/supabase/supabaseClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { Database } from "../api/supabase/supabase";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import axios from "axios";

export type Hold = Database["public"]["Tables"]["hold"]["Row"];
type Holiday = {
  locdate: number;
  seq: number;
  dateKind: string;
  isHoliday: string;
  dateName: string;
};

export const holdQueryKeys = createQueryKeys("hold", {
  // Hold/Hold
  // Hold 목록
  list: () => ({
    queryKey: ["all"],
    queryFn: async (): Promise<Hold[]> => {
      const data = await supabase
        .from("hold")
        .select("*")
        .order("id", { ascending: false });
      return await handleSupabaseResponse(data);
    },
  }),
  // Hold/EditHold
  // Hold 수정 시 기존 값 조회
  detail: (holdId: number) => ({
    queryKey: [holdId],
    queryFn: async () => {
      const data: PostgrestSingleResponse<Hold[]> = await supabase
        .from("hold")
        .select("*")
        .eq("id", holdId);
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
