import { Link, useLocation } from "react-router-dom";
import ActionButton from "../../../components/common/ActionButton";
import Line from "../../../components/common/Line";
import {
  useSuspenseQuery,
  QueryKey,
  QueryFunction,
} from "@tanstack/react-query";
import { FaPencil } from "react-icons/fa6";
import { noticeQueryKeys } from "../../../queries/noticeQueries";
import { wodQueryKeys } from "../../../queries/wodQueries";
import { Notice, Wod } from "../../../types/type";
import ContentItem from "./ContentItem";

const ContentList = () => {
  // 경로에 따라 wrapper CSS를 다르게 설정하기 위한 코드
  const { pathname } = useLocation();
  const wrapperClassName = pathname === "/" ? "home_memu_wrapper" : "wrapper";

  const isNoticeOrHomePath = pathname === "/notice" || pathname === "/";
  const title = isNoticeOrHomePath ? "Notice" : "WOD";
  const contentType = title.toLowerCase();
  const writePath = isNoticeOrHomePath ? "/notice/write" : "/wod/write";
  const query = isNoticeOrHomePath
    ? noticeQueryKeys.list()
    : wodQueryKeys.list();

  const { data: items } = useSuspenseQuery({
    queryKey: query.queryKey as QueryKey,
    queryFn: query.queryFn as QueryFunction<Notice[] | Wod[]>,
  });

  return (
    <div className={wrapperClassName}>
      <h1 className="title">{title}</h1>
      <div>
        {items?.map((item) => (
          <div key={item.id}>
            <ContentItem {...item} contentType={contentType} />
            <Line />
          </div>
        ))}
      </div>

      <ActionButton>
        <Link to={writePath} className="write_button">
          <FaPencil />
        </Link>
      </ActionButton>
    </div>
  );
};

export default ContentList;
