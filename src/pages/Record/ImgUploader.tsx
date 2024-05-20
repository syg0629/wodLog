import { ChangeEvent, useState } from "react";
import "./ImgUploader.css";

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
    <div>
      <div>{type}</div>
      {uploadImgUrl[id] === undefined ? (
        <label htmlFor={`fileTag-${id}`}>등록하기</label>
      ) : (
        ""
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onChangeImgUpload}
        id={`fileTag-${id}`}
        hidden={true}
      />
      {uploadImgUrl[id] && (
        <img className="write_record_preview" src={uploadImgUrl} />
      )}
    </div>
  );
};
export default ImageUploader;
