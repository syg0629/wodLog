import "./Notice.css";
import "../../components/common/Common.css";
import { Link, useLocation } from "react-router-dom";
import ActionButton from "../../components/common/ActionButton";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import NoticeItem from "../../pages/Notice/NoticeItem";
import Line from "../../components/common/Line";
import { noticeQueryKeys } from "../../queries/noticeQueries";
import { useSuspenseQuery } from "@tanstack/react-query";

const Notice = () => {
  // 경로에 따라 Notice wrapper CSS를 다르게 설정하기 위한 코드
  const { pathname } = useLocation();
  const noticeWrapperClassName =
    pathname === "/" ? "home_notice_wrapper" : "notice_wrapper";

  const { data: notice } = useSuspenseQuery(noticeQueryKeys.list());

  // delta로 저장된 contents를 html로 변환
  const deltaToHtmlData = notice.map((post) => {
    const postContent = post.content;
    const deltaOps = JSON.parse(postContent).ops;
    const deltaToHtmlConverter = new QuillDeltaToHtmlConverter(deltaOps, {});
    const html = deltaToHtmlConverter.convert();
    return { ...post, content: html };
  });

  return (
    <div className={noticeWrapperClassName}>
      <h1 className="title">Notice</h1>
      {/* <h4 className="notice_count">총 {notice.length}개의 글이 있습니다🏋🏻‍♀️</h4> */}

      <div>
        {deltaToHtmlData.map((post) => (
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
