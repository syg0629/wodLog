import { ChangeEvent, useState } from "react";
import "./Record.css";
import { FaImage } from "react-icons/fa";
import { IoDocumentText } from "react-icons/io5";

interface ImageUploaderProps {
  onImgChange: (imgUrl: string, id: number, type: string) => void;
  id: number;
  type: string;
}

const ImageUploader = ({ onImgChange, id, type }: ImageUploaderProps) => {
  const [uploadImgUrl, setUploadImgUrl] = useState<string>("");

  const onChangeImgUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const uploadFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setUploadImgUrl(result);
        onImgChange(result, id, type);
      }
    };
  };

  return (
    <>
      {uploadImgUrl[id] === undefined && (
        <label className="record_registration_btn" htmlFor={`fileTag-${id}`}>
          {type}&nbsp;기록 등록
        </label>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onChangeImgUpload}
        id={`fileTag-${id}`}
        hidden={true}
      />
      {uploadImgUrl[id] && (
        <>
          <span className="message">
            <FaImage />
            &nbsp;&nbsp;이미지
            <br />
            등록 완료
          </span>
          <img className="write_record_preview" src={uploadImgUrl} />
          <span className="message">
            <IoDocumentText />
            &nbsp;&nbsp; 텍스트
            <br />
            변환 완료
          </span>
        </>
      )}
    </>
  );
};
export default ImageUploader;
