import Line from "../../components/Line";
import { Database } from "../../api/supabase/supabase";
import { supabase } from "../../api/supabase/supabaseClient";
import dayjs from "dayjs";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import "./DetailNotice.css";
import { useQuery } from "@tanstack/react-query";
import { handleSupabaseResponse } from "../../utils/handleSupabaseResponse";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type Notice = Database["public"]["Tables"]["notice"]["Row"];

const DetailNotice = () => {
  const params = useParams();
  const noticeId = Number(params.id);
  const navigate = useNavigate();

  const { data: notice } = useQuery<Notice[]>({
    queryKey: ["detailNotice"],
    queryFn: async (): Promise<Notice[]> => {
      const data: PostgrestSingleResponse<Notice[]> = await supabase
        .from("notice")
        .select("*")
        .eq("id", noticeId);

      const detailNoticeData = await handleSupabaseResponse(data);
      const deltaToHtml = (await detailNoticeData).map((post: Notice) => {
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

  const onClickMoveToEdit = (id: number): void => {
    navigate(`/notice/${id}/edit`);
  };

  const onClickDeleteNotice = async () => {
    if (confirm("삭제하시겠습니까?")) {
      await supabase.from("notice").delete().eq("id", noticeId);
      alert("해당 게시물이 삭제되었습니다.");
      navigate("/notice", { replace: true });
    } else {
      return;
    }
  };

  return (
    <>
      <h1 className="title">Notice</h1>
      <div className="notice_wrapper">
        {notice?.map((post) => (
          <div key={post.id}>
            <h1 className="detail_notice_title">{post.title}</h1>
            <div className="detail_notice_head_detail">
              <div className="detail_notice_head_detail_left">
                <span className="detail_notice_head_detail_left_writer">
                  {post.writer}
                </span>
                <span>
                  {dayjs(post.createdDate).format("YYYY.MM.DD. HH:mm")}
                </span>
              </div>
              <div className="detail_notice_head_detail_right">
                <button
                  onClick={() => onClickMoveToEdit(post.id)}
                  className="detail_notice_head_detail_right_editBtn"
                >
                  수정하기
                </button>
                <button onClick={() => onClickDeleteNotice()}>삭제하기</button>
              </div>
            </div>
            <Line />
            <div className="detail_notice_main_content">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(String(post.content)),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DetailNotice;
