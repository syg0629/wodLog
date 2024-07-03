import Line from "../../../components/common/Line";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import "../../../components/common/Common.css";
import { noticeQueryKeys } from "../../../queries/noticeQueries";
import { wodQueryKeys } from "../../../queries/wodQueries";
import { Notice, Wod } from "../../../types/type";
import { supabase } from "../../../api/supabase/supabaseClient";
import { useLocation } from "react-router-dom";
import { QueryKey, QueryFunction, useQuery } from "@tanstack/react-query";
import { formatUtcDateToString } from "../../../utils/formattedDate";
import NoPost from "../../../components/common/NoPost";
import "react-quill/dist/quill.snow.css";
import Loader from "../../../components/common/Loader";

const DetailContent = () => {
  const params = useParams();
  const contentId = Number(params.id);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isWodOrHomePath = pathname.includes("wod") || isHome;

  const title = isWodOrHomePath ? "WOD" : "Notice";
  const contentType = title.toLowerCase();
  // 경로에 따라 wrapper CSS를 다르게 설정하기 위한 코드
  const wrapperClassName = isHome ? "home_memu_wrapper" : "wrapper";

  // wodQueryKeys.detailHome(): 홈에서 wod 조회 시 오늘 날짜의 wod만 보여주기 위한 코드
  const query = isWodOrHomePath
    ? isHome
      ? wodQueryKeys.detailHome()
      : wodQueryKeys.detail(contentId)
    : noticeQueryKeys.detail(contentId);
  const { data: queryResult, isLoading } = useQuery({
    queryKey: query.queryKey as QueryKey,
    queryFn: query.queryFn as QueryFunction<Wod[] | Notice[]>,
    enabled: isHome || !!contentId,
  });

  if (isLoading) {
    return <Loader />;
  }

  const editContent = (id: number): void => {
    navigate(`/${contentType}/${id}/edit`);
  };

  const deleteContent = async () => {
    if (!confirm("삭제하시겠습니까?")) return;
    try {
      await supabase.from(contentType).delete().eq("id", contentId);
      alert("해당 게시물이 삭제되었습니다.");
      navigate(`/${contentType}`, { replace: true });
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      alert("게시물 삭제 중 오류가 발생했습니다.");
    }
  };

  const renderContent = () => {
    if (!queryResult || queryResult.length === 0) {
      return isHome && <NoPost post={title} />;
    }

    return queryResult.map((post) => (
      <div key={`post-${post.id}`}>
        {/* 홈 페이지 경우 제목, 작성자, 작성일, 수정, 삭제버튼 안보이게 */}
        {!isHome && (
          <>
            <h1 className="detail_title">{post.title}</h1>
            <div className="detail_head">
              <div className="detail_head_left">
                <span className="detail_head_left_writer">{post.writer}</span>
                <span>{formatUtcDateToString(post.createdDate)}</span>
              </div>

              <div className="detail_head_right">
                <button
                  onClick={() => editContent(post.id)}
                  className="detail_head_right_edit_btn"
                >
                  수정하기
                </button>
                <button onClick={deleteContent}>삭제하기</button>
              </div>
            </div>
            <Line />
          </>
        )}
        <div className="detail_main_content">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.content),
            }}
          />
        </div>
      </div>
    ));
  };

  return (
    <div className={wrapperClassName}>
      <h1 className="title">{title}</h1>
      {renderContent()}
    </div>
  );
};

export default DetailContent;
