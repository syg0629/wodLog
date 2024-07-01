import { supabase } from "../api/supabase/supabaseClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import dayjs from "dayjs";
import { deltaToHtml } from "../utils/deltaToHtml";
import { Wod } from "../types/type";
import { createDetailQueryFn, createListQueryFn } from "./createQueryFns";

// home에서 오늘 WOD 조회
const today = dayjs().format("YYYYMMDD");

export const wodQueryKeys = createQueryKeys("wod", {
  // ContentList
  // WOD 목록
  list: () => ({
    queryKey: ["all"],
    queryFn: createListQueryFn<Wod>("wod"),
  }),
  // DetailContent, EditContent
  // WOD 상세 페이지 / WOD 수정 시 기존 값 조회
  detail: (wodId: number) => ({
    queryKey: ["wodId"],
    queryFn: () => createDetailQueryFn<Wod>("wod")(wodId),
  }),
  // Home
  // 홈에서 오늘 WOD 조회
  detailHome: () => ({
    queryKey: ["home"],
    queryFn: async () => {
      const data = await supabase
        .from("wod")
        .select("content")
        .like("title", `%${today}%`);
      const detailWodHome = await handleSupabaseResponse(data);
      return deltaToHtml(detailWodHome);
    },
  }),
});
