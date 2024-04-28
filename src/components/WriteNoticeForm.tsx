// TODO: 임시저장 기능

import "react-quill/dist/quill.snow.css";
import { SubmitHandler, useForm, useController } from "react-hook-form";
import "./WriteNoticeForm.css";
import Line from "./Line";
import { supabase } from "../api/supabase/supabaseClient";
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import { modules } from "./EditorModules";
import { Database } from "../api/supabase/supabase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import { useMutation } from "@tanstack/react-query";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type Notice = Database["public"]["Tables"]["notice"]["Row"];

interface WriteProps {
  isEdit: boolean;
  data?: Notice[];
}

const WriteNoticeForm = (props: WriteProps) => {
  const params = useParams();
  const noticeId = Number(params.id);
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);

  const saveNotice = useMutation<Notice, Error, Notice>({
    mutationFn: async (noticeData: Notice): Promise<Notice> => {
      const { title, content, writer, createdDate } = noticeData;
      const savedNotice: PostgrestSingleResponse<Notice[]> = props.isEdit
        ? await supabase
            .from("notice")
            .update({ title, content, createdDate })
            .eq("id", noticeId)
            .select()
        : await supabase
            .from("notice")
            .insert([{ title, content, writer, createdDate }])
            .select();

      const formattedData = await handleSupabaseResponse(savedNotice);
      return formattedData[0];
    },
    onSuccess: async (savedNotice: Notice): Promise<void> => {
      const savedNoticeId: number = savedNotice.id;
      if (savedNoticeId) {
        navigate(`/notice/${savedNoticeId}`);
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.log("공지사항 등록/수정 시 오류 >> ", error.message);
      }
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<Notice>();

  const {
    field: { value, onChange },
  } = useController({ name: "content", control, rules: { required: true } });

  useEffect(() => {
    onChange(props.data?.[0].content || "");
  }, [props.data, onChange]);

  const onChangeContents = (content: string) => {
    onChange(content === "<p><br></p>" ? "" : content);
  };

  const onClickSubmit: SubmitHandler<Notice> = (data: Notice) => {
    const quillEditor = quillRef.current?.getEditor();
    const content = quillEditor?.getContents();

    const formattedData = {
      ...data,
      content: JSON.stringify(content),
      createdDate: dayjs().format("YYYY.MM.DD HH:mm:ss"),
      writer: "작성자",
    };

    const confirmMessage = props.isEdit
      ? "수정하시겠습니까?"
      : "등록하시겠습니까?";

    if (confirm(confirmMessage)) {
      saveNotice.mutate(formattedData);
    }
  };

  return (
    <div className="write_wrapper">
      <form onSubmit={handleSubmit(onClickSubmit)}>
        <div className="write_btn_wrapper">
          <button>임시저장</button>
          <button className="write_btn_submit">
            {props.isEdit ? "수정하기" : "등록하기"}
          </button>
        </div>
        <Line />
        <input
          type="text"
          placeholder="제목을 입력하세요."
          className="write_title"
          {...register("title", { required: true })}
          defaultValue={props.data?.[0].title}
        />
        {errors?.title?.type === "required" && (
          <div className="errorMessage">제목을 입력해주세요.</div>
        )}
        {errors?.content?.type === "required" && (
          <div className="errorMessage">본문 내용을 입력해주세요.</div>
        )}
        <br />
        <ReactQuill
          value={value || ""}
          onChange={onChangeContents}
          placeholder="본문 내용을 입력하세요."
          className="write_content_reactQuill"
          modules={modules}
          ref={quillRef}
        />
      </form>
    </div>
  );
};
export default WriteNoticeForm;
