import "react-quill/dist/quill.snow.css";
import { SubmitHandler, useController, useForm } from "react-hook-form";
import "../../styles/WriteContentForm.css";
import Line from "../../components/common/Line";
import dayjs from "dayjs";
import ReactQuill from "react-quill";
import { modules } from "../../utils/EditorModules";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { FaExclamationCircle } from "react-icons/fa";
import { createSaveQueryFn } from "../../queries/createQueryFns";
import { ContentWithUserInfo } from "../../types/type";
import { useAuthenticatedUserInfo } from "../../hooks/useAuthenticatedUserInfo";

type ContentType = "notice" | "wod";

interface WriteContentFormProps {
  isEdit: boolean;
  editData?: ContentWithUserInfo;
  contentType: ContentType;
}

const WriteContentForm = ({
  isEdit,
  editData,
  contentType,
}: WriteContentFormProps) => {
  const params = useParams();
  const contentId = Number(params.id);
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);
  const userInfo = useAuthenticatedUserInfo();

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<ContentWithUserInfo>({
    defaultValues: {
      title: editData?.title ?? "",
      content: editData?.content ?? "",
    },
  });

  const {
    field: { value, onChange },
  } = useController({
    name: "content",
    control,
    rules: { required: true },
  });

  const saveData = useMutation<ContentWithUserInfo, Error, ContentWithUserInfo>(
    {
      mutationFn: createSaveQueryFn<ContentWithUserInfo>(
        contentType,
        isEdit,
        contentId
      ),
      onSuccess: (savedData: ContentWithUserInfo) => {
        navigate(`/${contentType}/${savedData.id}`);
      },
      onError: (error) => {
        console.error(
          `${isEdit ? "수정" : "등록"} 중 오류 발생 >> `,
          error.message
        );
        alert(`${isEdit ? "수정" : "등록"} 중 오류가 발생했습니다.`);
      },
    }
  );

  const onChangeContents = (content: string) => {
    onChange(content === "<p><br></p>" ? "" : content);
  };

  const submitContent: SubmitHandler<ContentWithUserInfo> = (
    formData: ContentWithUserInfo
  ) => {
    const quillEditor = quillRef.current?.getEditor();
    const content = quillEditor?.getContents();

    const formattedData = {
      ...formData,
      content: JSON.stringify(content),
      createdDate: dayjs().format("YYYY.MM.DD HH:mm:ss"),
      userInfo: {
        userName: userInfo.userName,
        writerUuid: userInfo.writerUuid,
        auth: userInfo.auth,
      },
    };

    const confirmMessage = isEdit ? "수정하시겠습니까?" : "등록하시겠습니까?";
    if (confirm(confirmMessage)) {
      saveData.mutate(formattedData);
    }
  };

  return (
    <div className="wrapper">
      <h1 className="title">{contentType === "notice" ? "Notice" : "WOD"}</h1>
      <form onSubmit={handleSubmit(submitContent)}>
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
          <div className="error_message">
            <FaExclamationCircle /> 제목을 입력해주세요.
          </div>
        )}
        {errors.content && (
          <div className="error_message">
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
