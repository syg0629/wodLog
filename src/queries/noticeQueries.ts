import { createQueryKeys } from "@lukemorales/query-key-factory";
import { createDetailQueryFn, createListQueryFn } from "./createQueryFns";

export const noticeQueryKeys = createQueryKeys("notice", {
  // ContentList
  // Notice 목록
  list: () => ({
    queryKey: ["all"],
    queryFn: createListQueryFn("notice"),
  }),
  // DetailContent, EditContent
  // Notice 상세 페이지 / Notice 수정 시 기존 값 조회
  detail: (noticeId: number) => ({
    queryKey: [noticeId],
    queryFn: () => createDetailQueryFn("notice")(noticeId),
  }),
});
