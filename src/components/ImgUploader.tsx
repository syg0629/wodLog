import { ChangeEvent, useState } from "react";
import "./ImgUploader.css";

interface ImageUploaderProps {
  onImgChange: (imgUrl: string, idx: number, title: string) => void;
  idx: number;
  title: string;
}

const ImageUploader = ({ onImgChange, idx, title }: ImageUploaderProps) => {
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
        onImgChange(result, idx, title);
      }
    };
  };

  return (
    <div>
      <div>{title}</div>
      {uploadImgUrl[idx] === undefined ? (
        <label htmlFor={`fileTag-${idx}`}>등록하기</label>
      ) : (
        ""
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onChangeImgUpload}
        id={`fileTag-${idx}`}
        hidden={true}
      />
      {uploadImgUrl[idx] && (
        <img className="write_record_preview" src={uploadImgUrl} />
      )}
    </div>
  );
};
export default ImageUploader;
