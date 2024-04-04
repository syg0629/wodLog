import { useEffect, useState } from "react";
import "./TextRecognizer.css";
import Tesseract from "tesseract.js";

interface TextRecognizerProps {
  imgUrl: string;
  id: number;
  type: string;
  onTextRecognition: (text: string, id: number, type: string) => void;
}

const TextRecognizer = ({
  imgUrl,
  id,
  type,
  onTextRecognition,
}: TextRecognizerProps) => {
  const [recognizedText, setRecognizedText] = useState<string>("");

  useEffect(() => {
    if (imgUrl) {
      recognizeImgText(imgUrl, id, type);
    }
  }, [imgUrl, id, type]);

  const recognizeImgText = (imgUrl: string, id: number, type: string) => {
    Tesseract.recognize(imgUrl, "eng+kor", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          // 텍스트 인식 진행률
          const progress = Number(m.progress.toFixed(2)) * 100;
          console.log(`진행률: ${progress}%`);
        }
      },
    })
      .catch((error) => {
        console.log("err", error);
      })
      .then((result) => {
        if (result && result.data.text) {
          setRecognizedText(result.data.text);
          onTextRecognition(result.data.text, id, type);
        }
      });
  };
  return <div className="write_record_tesseract">{recognizedText}</div>;
};
export default TextRecognizer;
