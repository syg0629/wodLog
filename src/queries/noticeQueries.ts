import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../api/supabase/supabaseClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { Database } from "../api/supabase/supabase";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";

type Notice = Database["public"]["Tables"]["notice"]["Row"];

// Notice/Notice
const noticeQueryKeys = createQueryKeys("notice", {
  fetchNoticeList: () => ["noticeList"],
  fetchNoticeDetail: (noticeId) => ["fetchNoticeDetail", noticeId],
});

export function useFetchNoticeList() {
  return useSuspenseQuery({
    queryKey: noticeQueryKeys.fetchNoticeList().queryKey,
    queryFn: async () => {
      const data = await supabase
        .from("notice")
        .select("*")
        .order("id", { ascending: false });
      return await handleSupabaseResponse(data);
    },
  });
}

// Notice/DetailNotice
// Notice/EditNotice
export function useFetchNoticeDetail(noticeId: number) {
  return useQuery({
    queryKey: noticeQueryKeys.fetchNoticeDetail(noticeId).queryKey,
    queryFn: async () => {
      const data: PostgrestSingleResponse<Notice[]> = await supabase
        .from("notice")
        .select("*")
        .eq("id", noticeId);
      return await handleSupabaseResponse(data);
    },
  });
}
