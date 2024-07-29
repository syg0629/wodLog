import "../../../components/common/Common.css";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { formatUtcDateToString } from "../../../utils/formattedDate";
import { ContentWithUserInfo } from "../../../types/type";

const ContentItem = ({
  contentType,
  id,
  title,
  createdDate,
  content,
  userInfo: { userName },
}: ContentWithUserInfo & { contentType: string }) => {
  const navigate = useNavigate();

  const handleMoveToDetail = () => {
    navigate(`/${contentType}/${id}`);
  };

  // Notice Content Preview: html코드를 제거하고 공백을 넣어 텍스트만 추출
  const strippedContent = content.replace(/<[^>]+>/g, " ");

  return (
    <article className="article" onClick={handleMoveToDetail}>
      <div className="article_head">
        <h1 className="article_title">{title}</h1>
        <div className="article_write_info">
          <span className="article_writer">{userName}</span>
          <span className="article_date">
            {formatUtcDateToString(createdDate)}
          </span>
        </div>
      </div>
      {contentType === "notice" && (
        <div
          className="article_content_preview"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(strippedContent),
          }}
        />
      )}
    </article>
  );
};
export default ContentItem;
