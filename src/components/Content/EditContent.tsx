import { useParams } from "react-router-dom";
import { noticeQueryKeys } from "../../queries/noticeQueries";
import { wodQueryKeys } from "../../queries/wodQueries";
import WriteContentForm from "./WriteContentForm";
import {
  QueryFunction,
  QueryKey,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ContentWithUserInfo } from "../../types/type";

type ContentType = "notice" | "wod";

interface EditContentProps {
  contentType: ContentType;
}

const EditContent = ({ contentType }: EditContentProps) => {
  const params = useParams();
  const contentId = Number(params.id);

  const query =
    contentType === "notice"
      ? noticeQueryKeys.detail(contentId)
      : wodQueryKeys.detail(contentId);
  const { data: editData } = useSuspenseQuery({
    queryKey: query.queryKey as QueryKey,
    queryFn: query.queryFn as QueryFunction<ContentWithUserInfo>,
  });

  return (
    <WriteContentForm
      isEdit={true}
      editData={editData}
      contentType={contentType}
    />
  );
};

export default EditContent;
