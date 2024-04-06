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
    let isMounted = true;
    if (imgUrl) {
      recognizeImgText(imgUrl, id, type);
    }
    return () => {
      isMounted = false;
    };
  }, [imgUrl, id, type]);

  const recognizeImgText = (imgUrl: string, id: number, type: string) => {
    Tesseract.recognize(imgUrl, "eng+kor", {
      logger: ({ status, progress }) => {
        if (status === "recognizing text") {
          // 텍스트 인식 진행률
          const progressPercentage = Number(progress.toFixed(2)) * 100;
          console.log(`진행률: ${progressPercentage}%`);
        }
      },
    })
      .catch((error: Error) => {
        console.log("텍스트 추출 중 에러 >> ", error.message);
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
