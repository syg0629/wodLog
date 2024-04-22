import "./Notice.css";
import "../../components/Components.css";
import { Link, useLocation } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { Database } from "../../api/supabase/supabase";
import { supabase } from "../../api/supabase/supabaseClient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import NoticeItem from "../../components/NoticeItem";
import Line from "../../components/Line";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { handleSupabaseResponse } from "../../utils/handleSupabaseResponse";

type Notice = Database["public"]["Tables"]["notice"]["Row"];

const Notice = () => {
  // 경로에 따라 Notice wrapper CSS를 다르게 설정하기 위한 코드
  const { pathname } = useLocation();
  const noticeWrapperClassName =
    pathname === "/" ? "home_notice_wrapper" : "notice_wrapper";

  const { data: notice } = useSuspenseQuery<Notice[], Error>({
    queryKey: ["noticeList"],
    queryFn: async () => {
      const data: PostgrestSingleResponse<Notice[]> = await supabase
        .from("notice")
        .select("*")
        .order("id", { ascending: false });

      const noticeData = handleSupabaseResponse(data);
      // delta로 저장된 contents를 html로 변환
      const deltaToHtml = (await noticeData).map((post: Notice) => {
        const postContent = post.content;
        const deltaOps = JSON.parse(postContent).ops;
        const deltaToHtmlConverter = new QuillDeltaToHtmlConverter(
          deltaOps,
          {}
        );
        const html = deltaToHtmlConverter.convert();
        return { ...post, content: html };
      });
      return deltaToHtml;
    },
  });

  return (
    <div className={noticeWrapperClassName}>
      <h1 className="title">Notice</h1>
      <h4 className="notice_count">총 {notice.length}개의 글이 있습니다🏋🏻‍♀️</h4>

      <div className="notice_item_wrapper">
        {notice?.map((post) => (
          <div key={post.id}>
            <NoticeItem {...post} />
            <Line />
          </div>
        ))}
      </div>

      <ActionButton>
        <Link to="/notice/write" className="write_button">
          +
        </Link>
      </ActionButton>
    </div>
  );
};

export default Notice;
