import WriteNoticeForm from "../../components/WriteNoticeForm";
import { useParams } from "react-router-dom";
import { useFetchNoticeDetail } from "../../queries/noticeQueries";

const EditNotice = () => {
  const params = useParams();
  const noticeId = Number(params.id);

  const { data: editNoticeData } = useFetchNoticeDetail(noticeId);
  if (!editNoticeData) {
    return <div>Loading...</div>;
  }

  return <WriteNoticeForm isEdit={true} data={editNoticeData} />;
};
export default EditNotice;