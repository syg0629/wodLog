import { useParams } from "react-router-dom";
import { noticeQueryKeys } from "../../../queries/noticeQueries";
import { wodQueryKeys } from "../../../queries/wodQueries";
import WriteContentForm from "../../../components/common/Content/WriteContentForm";
import {
  QueryFunction,
  QueryKey,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Notice, Wod } from "../../../types/type";

interface EditContentProps {
  contentType: string;
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
    queryFn: query.queryFn as QueryFunction<Notice[] | Wod[]>,
  });

  return (
    <WriteContentForm isEdit={true} data={editData} contentType={contentType} />
  );
};

export default EditContent;
