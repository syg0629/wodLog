import WriteNoticeForm from "../../pages/Notice/WriteNoticeForm";
import { useParams } from "react-router-dom";
import { noticeQueryKeys } from "../../queries/noticeQueries";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/common/Loader";

const EditNotice = () => {
  const params = useParams();
  const noticeId = Number(params.id);

  const { data: editNoticeData } = useQuery(noticeQueryKeys.detail(noticeId));
  if (!editNoticeData) {
    return <Loader />;
  }

  return <WriteNoticeForm isEdit={true} data={editNoticeData} />;
};
export default EditNotice;
