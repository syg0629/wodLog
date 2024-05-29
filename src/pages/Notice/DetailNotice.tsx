import Line from "../../components/common/Line";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import "../../components/common/Common.css";
import { noticeQueryKeys } from "../../queries/noticeQueries";
import { supabase } from "../../api/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { formatUtcDate } from "../../utils/formattedDate";

const DetailNotice = () => {
  const params = useParams();
  const noticeId = Number(params.id);
  const navigate = useNavigate();

  const { data: detailNoticeData } = useQuery(noticeQueryKeys.detail(noticeId));

  if (!detailNoticeData) {
    return <div>Loading...</div>;
  }

  const onClickMoveToEdit = (id: number): void => {
    navigate(`/notice/${id}/edit`);
  };

  const onClickDeleteNotice = async () => {
    if (!confirm("삭제하시겠습니까?")) {
      return;
    } else {
      await supabase.from("notice").delete().eq("id", noticeId);
      alert("해당 게시물이 삭제되었습니다.");
      navigate("/notice", { replace: true });
    }
  };

  return (
    <>
      <div className="wrapper">
        <h1 className="title">Notice</h1>
        {detailNoticeData.map((post) => (
          <div key={post.id}>
            <h1 className="detail_title">{post.title}</h1>
            <div className="detail_head_detail">
              <div className="detail_head_detail_left">
                <span className="detail_head_detail_left_writer">
                  {post.writer}
                </span>
                <span>{formatUtcDate(post.createdDate)}</span>
              </div>
              <div className="detail_head_detail_right">
                <button
                  onClick={() => onClickMoveToEdit(post.id)}
                  className="detail_head_detail_right_editBtn"
                >
                  수정하기
                </button>
                <button onClick={() => onClickDeleteNotice()}>삭제하기</button>
              </div>
            </div>
            <Line />
            <div className="detail_main_content">
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
