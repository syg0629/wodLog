import { supabase } from "../config/supabaseClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import dayjs from "dayjs";
import { deltaToHtml } from "../utils/deltaToHtml";
import { createDetailQueryFn, createListQueryFn } from "./createQueryFns";

// home에서 오늘 WOD 조회
const today = dayjs().format("YYYYMMDD");

export const wodQueryKeys = createQueryKeys("wod", {
  // ContentList
  // WOD 목록
  list: () => ({
    queryKey: ["all"],
    queryFn: createListQueryFn("wod"),
  }),
  // DetailContent, EditContent
  // WOD 상세 페이지 / WOD 수정 시 기존 값 조회
  detail: (wodId: number) => ({
    queryKey: ["wodId"],
    queryFn: () => createDetailQueryFn("wod")(wodId),
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
      const detailWodHome = handleSupabaseResponse(data);
      if (detailWodHome.length === 0) {
        return null;
      }
      return deltaToHtml(detailWodHome)[0];
    },
  }),
});
