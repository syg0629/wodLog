import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../api/supabase/supabaseClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { Database } from "../api/supabase/supabase";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

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
      const noticeData = await handleSupabaseResponse(data);
      const deltaToHtmlNoticeData = noticeData.map((post) => {
        const postContent = post.content;
        const deltaOps = JSON.parse(postContent).ops;
        const deltaToHtmlConverter = new QuillDeltaToHtmlConverter(
          deltaOps,
          {}
        );
        const html = deltaToHtmlConverter.convert();
        return { ...post, content: html };
      });
      return deltaToHtmlNoticeData;
    },
  });
}
