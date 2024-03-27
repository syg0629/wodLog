import { ChangeEvent, useState } from "react";
import "./AddRecord.css";
import Tesseract from "tesseract.js";

const recordTitle = ["Rx’d", "A", "B", "C"];

const AddRecord = () => {
  const [uploadImgUrls, setUploadImgUrls] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);

  const onChangeImgUpload = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const { files } = e.target;
    if (!files) return;

    const uploadFile = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const newUrls = [...uploadImgUrls];
        newUrls[idx] = result;
        setUploadImgUrls(newUrls);
        recognizeImgText(result, idx);
      }
    };
  };

  const recognizeImgText = (imgUrl: string, idx: number) => {
    Tesseract.recognize(imgUrl, "eng+kor", {
      logger: (m) => console.log(m),
    })
      .catch((err) => {
        console.log("err", err);
      })
      .then((result) => {
        if (result && result.data.text) {
          const newResults = [...results];
          newResults[idx] = result.data.text;
          setResults(newResults);
        }
      });
  };

  return (
    <>
      <h1 className="title">Record</h1>
      <div className="add_record_wrapper">
        <div className="add_record_grade_wrapper">
          {recordTitle.map((title, idx) => (
            <div key={idx}>
              <div>{title}</div>
              {uploadImgUrls[idx] === undefined ? (
                <label htmlFor={`fileTag-${idx}`}>등록하기</label>
              ) : (
                ""
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onChangeImgUpload(e, idx)}
                id={`fileTag-${idx}`}
                hidden={true}
              />
              {uploadImgUrls[idx] && (
                <img className="add_record_preview" src={uploadImgUrls[idx]} />
              )}
              <div className="add_record_tesseract">{results[idx]}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddRecord;
