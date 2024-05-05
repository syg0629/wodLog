import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../api/supabase/supabaseClient";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { Database } from "../api/supabase/supabase";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

type Notice = Database["public"]["Tables"]["notice"]["Row"];

const noticeQueryKeys = createQueryKeys("notice", {
  fetchNoticeList: () => ["noticeList"],
  fetchNoticeDetail: (noticeId) => ["fetchNoticeDetail", noticeId],
  updateNotice: (noticeId) => ["updateNoticeDetail", noticeId],
  insertNotice: () => ["insertNotice"],
});

// Notice/Notice
// Notice 목록
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
// Notice 상세 페이지 / Notice 수정 시 기존 값 조회
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

// 공통 mutation
const savedNotice = async (
  noticeData: Notice,
  noticeId?: number
): Promise<Notice> => {
  const { title, content, createdDate } = noticeData;
  const savedNotice: PostgrestSingleResponse<Notice[]> = noticeId
    ? await supabase
        .from("notice")
        .update({ title, content, createdDate })
        .eq("id", noticeId)
        .select()
    : await supabase.from("notice").insert([noticeData]).select();
  return (await handleSupabaseResponse(savedNotice))[0];
};

// Notice/WriteNoticeForm
// 기존 Notice 수정
export function useUpdateNotice(noticeId: number) {
  return useMutation({
    mutationKey: noticeQueryKeys.updateNotice(noticeId).queryKey,
    mutationFn: (noticeData: Notice) => savedNotice(noticeData, noticeId),
  });
}

// Notice/WriteNoticeForm
// 신규 Notice 등록
export function useInsertNotice() {
  return useMutation({
    mutationKey: noticeQueryKeys.insertNotice().queryKey,
    mutationFn: (noticeData: Notice) => savedNotice(noticeData),
  });
}
