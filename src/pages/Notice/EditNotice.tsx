import WriteNoticeForm from "../../components/WriteNoticeForm";
import { useParams } from "react-router-dom";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useFetchNoticeDetail } from "../../queries/noticeQueries";

const EditNotice = () => {
  const params = useParams();
  const noticeId = Number(params.id);

  const { data: editNoticeData } = useFetchNoticeDetail(noticeId);
  if (!editNoticeData) {
    return <div>Loading...</div>;
  }
  const deltaToHtmlNoticeData = editNoticeData.map((post) => {
    const postContent = post.content;
    const deltaOps = JSON.parse(postContent).ops;
    const deltaToHtmlConverter = new QuillDeltaToHtmlConverter(deltaOps, {});
    const html = deltaToHtmlConverter.convert();
    return { ...post, content: html };
  });

  return <WriteNoticeForm isEdit={true} data={deltaToHtmlNoticeData} />;
};
export default EditNotice;
