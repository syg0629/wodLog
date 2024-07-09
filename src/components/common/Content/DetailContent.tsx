import Line from "../../../components/common/Line";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import "../../../components/common/Common.css";
import { noticeQueryKeys } from "../../../queries/noticeQueries";
import { wodQueryKeys } from "../../../queries/wodQueries";
import { Content } from "../../../types/type";
import { supabase } from "../../../api/supabase/supabaseClient";
import { useLocation } from "react-router-dom";
import { QueryKey, QueryFunction, useQuery } from "@tanstack/react-query";
import { formatUtcDateToString } from "../../../utils/formattedDate";
import NoPost from "../../../components/common/NoPost";
import "react-quill/dist/quill.snow.css";
import Loader from "../../../components/common/Loader";

type ContentType = "notice" | "wod";

interface QueryConfig {
  queryKey: QueryKey;
  queryFn: QueryFunction<Content>;
}

interface ContentConfig {
  title: string;
  getHomeQuery?: () => QueryConfig;
  getDetailQuery: (contentId: number) => QueryConfig;
}

const contentConfig: Record<ContentType, ContentConfig> = {
  notice: {
    title: "Notice",
    getDetailQuery: (contentId) => ({
      queryKey: noticeQueryKeys.detail(contentId).queryKey,
      queryFn: noticeQueryKeys.detail(contentId)
        .queryFn as QueryFunction<Content>,
    }),
  },
  wod: {
    title: "Wod",
    getDetailQuery: (contentId) => ({
      queryKey: wodQueryKeys.detail(contentId).queryKey,
      queryFn: wodQueryKeys.detail(contentId).queryFn as QueryFunction<Content>,
    }),
    getHomeQuery: () => ({
      queryKey: wodQueryKeys.detailHome().queryKey,
      queryFn: wodQueryKeys.detailHome().queryFn as QueryFunction<Content>,
    }),
  },
};

const useContentQuery = (
  contentType: ContentType,
  isHome: boolean,
  contentId?: number
) => {
  const config = contentConfig[contentType];
  const query =
    isHome && config.getHomeQuery
      ? config.getHomeQuery()
      : contentId !== undefined
      ? config.getDetailQuery(contentId)
      : null;

  if (!query) {
    throw new Error("유효하지 않은 쿼리");
  }

  return useQuery({ ...query, enabled: isHome || !!contentId });
};

const DetailContent = ({ contentType }: { contentType: ContentType }) => {
  const params = useParams();
  const contentId = Number(params.id);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const wrapperClassName = isHome ? "home_menu_item_wrapper" : "wrapper";
  const { title } = contentConfig[contentType];

  const { data: queryResult, isLoading } = useContentQuery(
    contentType,
    isHome,
    contentId
  );

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
    if (!queryResult) {
      return isHome && <NoPost post={title} />;
    }

    return (
      <div>
        {/* 홈 페이지 경우 제목, 작성자, 작성일, 수정, 삭제버튼 안보이게 */}
        {!isHome && (
          <>
            <h1 className="detail_title">{queryResult.title}</h1>
            <div className="detail_head">
              <div className="detail_head_left">
                <span className="detail_head_left_writer">
                  {queryResult.writer}
                </span>
                <span>{formatUtcDateToString(queryResult.createdDate)}</span>
              </div>

              <div className="detail_head_right">
                <button
                  onClick={() => editContent(queryResult.id)}
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
              __html: DOMPurify.sanitize(queryResult.content),
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={wrapperClassName}>
      <h1 className="title">{title}</h1>
      {renderContent()}
    </div>
  );
};

export default DetailContent;
