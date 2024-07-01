import "../../../components/common/Common.css";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { formatUtcDateToString } from "../../../utils/formattedDate";
import { ContentWithContentType } from "../../../types/type";

const ContentItem = ({
  contentType,
  id,
  title,
  createdDate,
  content,
  writer,
}: ContentWithContentType) => {
  const navigate = useNavigate();

  const onClickMoveToDetail = () => {
    navigate(`/${contentType}/${id}`);
  };

  // title, content Preview로 text 길이 제한
  // html코드를 제거하고 공백을 넣어 텍스트만 남기고 그 길이가 길 경우 잘라내고 ...로 보여주는 코드
  const stripHtmlAndPreview = (text: string, maxLength: number) => {
    const strippedText = text.replace(/<[^>]+>/g, " ");
    return strippedText.length > maxLength
      ? strippedText.slice(0, maxLength) + "..."
      : strippedText;
  };
  const titlePreview = stripHtmlAndPreview(title, 22);
  const contentPreview = stripHtmlAndPreview(content, 70);

  return (
    <article className="article" onClick={onClickMoveToDetail}>
      <div className="article_head">
        <h1 className="article_title">{titlePreview}</h1>
        <div className="article_write_info">
          <span className="article_writer">{writer}</span>
          <span className="article_date">
            {formatUtcDateToString(createdDate)}
          </span>
        </div>
      </div>
      {contentType === "notice" && (
        <div
          className="article_content_preview"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(contentPreview),
          }}
        />
      )}
    </article>
  );
};
export default ContentItem;
