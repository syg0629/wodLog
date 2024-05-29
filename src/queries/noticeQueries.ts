import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../api/supabase/supabaseClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { Database } from "../api/supabase/supabase";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import { deltaToHtml } from "../utils/deltaToHtml";

type Notice = Database["public"]["Tables"]["notice"]["Row"];

export const noticeQueryKeys = createQueryKeys("notice", {
  // Notice/Notice
  // Notice 목록
  list: () => ({
    queryKey: ["all"],
    queryFn: async (): Promise<Notice[]> => {
      const data = await supabase
        .from("notice")
        .select("*")
        .order("id", { ascending: false });
      const notice = await handleSupabaseResponse(data);
      return deltaToHtml(notice);
    },
  }),
  // Notice/DetailNotice
  // Notice/EditNotice
  // Notice 상세 페이지 / Notice 수정시 기존 값 조회
  detail: (noticeId: number) => ({
    queryKey: [noticeId],
    queryFn: async () => {
      const data: PostgrestSingleResponse<Notice[]> = await supabase
        .from("notice")
        .select("*")
        .eq("id", noticeId);
      const detailNotice = await handleSupabaseResponse(data);
      return deltaToHtml(detailNotice);
    },
  }),
});
