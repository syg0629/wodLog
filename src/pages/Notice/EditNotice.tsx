import { useQuery } from "@tanstack/react-query";
import WriteNoticeForm from "../../components/WriteNoticeForm";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Database } from "../../api/supabase/supabase";
import { supabase } from "../../api/supabase/supabaseClient";
import { handleSupabaseResponse } from "../../utils/handleSupabaseResponse";
import { useParams } from "react-router-dom";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

type Notice = Database["public"]["Tables"]["notice"]["Row"];

const EditNotice = () => {
  const params = useParams();
  const noticeId = Number(params.id);

  const { data } = useQuery<Notice[]>({
    queryKey: ["detailNotice"],
    queryFn: async (): Promise<Notice[]> => {
      const data: PostgrestSingleResponse<Notice[]> = await supabase
        .from("notice")
        .select("*")
        .eq("id", noticeId);

      const detailNoticeData = await handleSupabaseResponse(data);
      const deltaToHtml = detailNoticeData.map((post: Notice) => {
        const postContent = post.content;
        const deltaOps = JSON.parse(postContent).ops;
        const deltaToHtmlConverter = new QuillDeltaToHtmlConverter(
          deltaOps,
          {}
        );
        const html = deltaToHtmlConverter.convert();
        return { ...post, content: html };
      });
      return deltaToHtml;
    },
  });

  return <WriteNoticeForm isEdit={true} data={data} />;
};
export default EditNotice;
