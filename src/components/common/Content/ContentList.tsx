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
import ContentItem from "./ContentItem";
import { Notice, Wod } from "../../../types/type";

type ContentType = "notice" | "wod";

interface ContentListProps {
  contentType: ContentType;
}

interface ContentConfig<T> {
  title: string;
  writePath: string;
  queryKeys: {
    queryKey: QueryKey;
    queryFn: QueryFunction<T[]>;
  };
}

const contentConfig: Record<ContentType, ContentConfig<Notice | Wod>> = {
  notice: {
    title: "Notice",
    writePath: "/notice/write",
    queryKeys: {
      queryKey: noticeQueryKeys.list().queryKey,
      queryFn: noticeQueryKeys.list().queryFn as QueryFunction<Notice[]>,
    },
  },
  wod: {
    title: "WOD",
    writePath: "/wod/write",
    queryKeys: {
      queryKey: wodQueryKeys.list().queryKey,
      queryFn: wodQueryKeys.list().queryFn as QueryFunction<Wod[]>,
    },
  },
};

const ContentList = ({ contentType }: ContentListProps) => {
  // 경로에 따라 wrapper CSS를 다르게 설정하기 위한 코드
  const { pathname } = useLocation();
  const wrapperClassName =
    pathname === "/" ? "home_menu_item_wrapper" : "wrapper";

  const config = contentConfig[contentType];
  const { title, writePath, queryKeys } = config;

  const { data: items } = useSuspenseQuery(queryKeys);

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
