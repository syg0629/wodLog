import "react-quill/dist/quill.snow.css";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import "../../../components/common/Common.css";
import Line from "../../../components/common/Line";
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import { modules } from "../../../utils/EditorModules";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { FaExclamationCircle } from "react-icons/fa";
import { createSaveQueryFn } from "../../../queries/createQueryFns";
import { Content } from "../../../types/type";

interface WriteContentFormProps {
  isEdit: boolean;
  data?: Content[];
  contentType: string;
}

const WriteContentForm = ({
  isEdit,
  data,
  contentType,
}: WriteContentFormProps) => {
  const params = useParams();
  const contentId = Number(params.id);
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);

  const saveData = useMutation<Content, Error, Content>({
    mutationFn: createSaveQueryFn<Content>(contentType, isEdit, contentId),
    onSuccess: (savedData: Content) => {
      navigate(`/${contentType}/${savedData.id}`);
    },
    onError: (error) => {
      console.log(
        `${isEdit ? "수정" : "등록"} 중 오류 발생 >> `,
        error.message
      );
      alert(`${isEdit ? "수정" : "등록"} 중 오류가 발생했습니다.`);
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm<Content>({
    defaultValues: {
      title: data?.[0].title || "",
      content: data?.[0].content || "",
    },
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "content",
    control,
    rules: { required: true },
  });

  useEffect(() => {
    if (data?.[0].content) {
      setValue("content", data[0].content);
    }
  }, [data, setValue]);

  const onChangeContents = (content: string) => {
    onChange(content === "<p><br></p>" ? "" : content);
  };

  const onClickSubmit: SubmitHandler<Content> = (formData: Content) => {
    const quillEditor = quillRef.current?.getEditor();
    const content = quillEditor?.getContents();

    const formattedData = {
      ...formData,
      content: JSON.stringify(content),
      createdDate: dayjs().format("YYYY.MM.DD HH:mm:ss"),
      writer: "작성자",
    };

    const confirmMessage = isEdit ? "수정하시겠습니까?" : "등록하시겠습니까?";
    if (confirm(confirmMessage)) {
      saveData.mutate(formattedData);
    }
  };

  return (
    <div className="wrapper">
      <h1 className="title">{contentType === "notice" ? "Notice" : "WOD"}</h1>
      <form onSubmit={handleSubmit(onClickSubmit)}>
        <div className="write_btn_wrapper">
          <button className="write_btn_submit">
            {isEdit ? "수정하기" : "등록하기"}
          </button>
        </div>
        <Line />
        <input
          type="text"
          placeholder="제목을 입력하세요."
          className="write_title"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <div className="errorMessage">
            <FaExclamationCircle /> 제목을 입력해주세요.
          </div>
        )}
        {errors.content && (
          <div className="errorMessage">
            <FaExclamationCircle /> 본문 내용을 입력해주세요.
          </div>
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
export default WriteContentForm;
