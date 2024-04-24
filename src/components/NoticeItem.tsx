import "./NoticeItem.css";
import { Database } from "../api/supabase/supabase";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import Line from "./Line";
import dayjs from "dayjs";

type Notice = Database["public"]["Tables"]["notice"]["Row"];

const NoticeItem = ({ id, title, createdDate, content }: Notice) => {
  const navigate = useNavigate();

  const onClickMoveToDetail = (id: number) => {
    navigate(`/notice/${id}`);
  };

  return (
    <div>
      <article
        className="notice_article"
        onClick={() => onClickMoveToDetail(id)}
      >
        <div>
          <div className="notice_article_title">{title}</div>
          <span className="notice_article_date">
            {dayjs(createdDate).format("YYYY.MM.DD. HH:mm")}
          </span>
          <Line />
          <div
            className="notice_article_content_preview"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(String(content)),
            }}
          />
        </div>
      </article>
    </div>
  );
};
export default NoticeItem;
