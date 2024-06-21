import WriteNoticeForm from "../../pages/Notice/WriteNoticeForm";
import { useParams } from "react-router-dom";
import { noticeQueryKeys } from "../../queries/noticeQueries";
import { useSuspenseQuery } from "@tanstack/react-query";

const EditNotice = () => {
  const params = useParams();
  const noticeId = Number(params.id);

  const { data: editNoticeData } = useSuspenseQuery(
    noticeQueryKeys.detail(noticeId)
  );

  return <WriteNoticeForm isEdit={true} data={editNoticeData} />;
};
export default EditNotice;
