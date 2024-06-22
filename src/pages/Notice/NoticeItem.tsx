import "./NoticeItem.css";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import { formatUtcDateToString } from "../../utils/formattedDate";
import { Notice } from "../../types/type";

const NoticeItem = ({ id, title, createdDate, content, writer }: Notice) => {
  const navigate = useNavigate();

  const onClickMoveToDetail = (id: number) => {
    navigate(`/notice/${id}`);
  };

  // content preview
  // html코드를 제거하고 공백을 넣어 텍스트만 남기고 그 길이가 길 경우 잘라내고 ...로 보여주는 코드
  const text = content.replace(/<[^>]+>/g, " ");
  const textPreview = text.length > 70 ? text.slice(0, 70) + "..." : text;

  return (
    <div>
      <article
        className="notice_article"
        onClick={() => onClickMoveToDetail(id)}
      >
        <div className="notice_article_head">
          <div className="notice_article_title">{title}</div>
          <div className="notice_article_write_info">
            <span className="notice_article_writer">{writer}</span>
            <span className="notice_article_date">
              {formatUtcDateToString(createdDate)}
            </span>
          </div>
        </div>
        <div
          className="notice_article_content_preview"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(String(textPreview)),
          }}
        />
      </article>
    </div>
  );
};
export default NoticeItem;
