import "../../components/common/Common.css";
import { Link, useLocation } from "react-router-dom";
import ActionButton from "../../components/common/ActionButton";
import NoticeItem from "../../pages/Notice/NoticeItem";
import Line from "../../components/common/Line";
import { noticeQueryKeys } from "../../queries/noticeQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FaPencil } from "react-icons/fa6";

const NoticeList = () => {
  // 경로에 따라 Notice wrapper CSS를 다르게 설정하기 위한 코드
  const { pathname } = useLocation();
  const noticeWrapperClassName =
    pathname === "/" ? "home_memu_wrapper" : "wrapper";

  const { data: notice } = useSuspenseQuery(noticeQueryKeys.list());

  return (
    <div className={noticeWrapperClassName}>
      <h1 className="title">Notice</h1>

      <div>
        {notice.map((post) => (
          <div key={post.id}>
            <NoticeItem {...post} />
            <Line />
          </div>
        ))}
      </div>

      <ActionButton>
        <Link to="/notice/write" className="write_button">
          <FaPencil />
        </Link>
      </ActionButton>
    </div>
  );
};

export default NoticeList;
