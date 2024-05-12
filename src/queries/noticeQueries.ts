import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../api/supabase/supabaseClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { Database } from "../api/supabase/supabase";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

type Notice = Database["public"]["Tables"]["notice"]["Row"];

export const noticeQueryKeys = createQueryKeys("notice", {
  // Notice/Notice
  // Notice 목록
  list: () => ({
    queryKey: ["all"],
    queryFn: async () => {
      const data = await supabase
        .from("notice")
        .select("*")
        .order("id", { ascending: false });
      return await handleSupabaseResponse(data);
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
  }),
});
